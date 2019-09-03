/*
 * 类似vuex中的接口进行状态管理
 * 利用postMessage和onMessage的方式进行跨页面间通信,类似浏览器的postMessage
 */

function getShortRoute(route) {
    return route.match(/\/(.+)\//)[1];
}

function genericSubscribe(fn, subs) {
    if (subs.indexOf(fn) < 0) {
        subs.push(fn);
    }
    return () => {   // 闭包,取消订阅
        const i = subs.indexOf(fn);
        if (i > -1) {
            subs.splice(i, 1);
        }
    }
}

export default class Store {
    constructor(config) {
        this.state = config.state || {};
        this.mutations = config.mutations || {};
        this.actions = config.actions || {};
        this.getters = config.getters || {};

        this._pages = [];
        this._messages = [];
        this._subscribers = [];
        this.$getter = {};

        this.subs = [];   // 存储计算属性订阅函数
    }

    get getter() {
        return this.$getter;
    }

    set getter(v) {
        throw new Error('getter is read-only');
    }

    install(page) {   //  let index = this._pages.indexOf(page) 无效
        page._shortRoute = getShortRoute(page.route);
        let index = this._pages.findIndex((item) => {
            return item.route === page.route;
        });
        if (index > -1) {
            this._pages.splice(index, 1);
        }
        this._pages.unshift(page);

        this.computed(page, page.computed);
        this.watch(page, page.watch);

        this.setState();
    }

    uninstall(page) {
        let index = this._pages.findIndex((item) => {
            return item.route === page.route;
        });
        if (index > -1) {
            this._pages.splice(index, 1);
        }
    }

    replaceState(data) {
        this.setState(data);
    }

    setState(data) {
        if (typeof data === 'object') {
            Object.assign(this.state, data);
        }
        if (Object.keys(this.getters).length > 0) {
            Object.keys(this.getters).map((item, index) => {
                this.$getter[item] = this.getters[item](this.state);
            });
        }
        this._pages.forEach(page => {
            page.setData({
                $state: this.state,
                $getter: this.$getter
            });
        });
    }

    commit(type, payload) {
        let mutation = this.mutations[type];
        let result = mutation && mutation(this.state, payload);
        this.setState();
        // 触发订阅
        this._subscribers.forEach(sub => sub(type, this.state));
        return result;
    }

    dispatch(type, payload) {
        let action = this.actions[type];
        return action && action(this, payload);
    }

    // 若设置lazy, 则在页面显示时才会运行onMessage钩子
    postMessage(routes, data, lazy) {
        let routeAlive = false;
        if (!Array.isArray(routes)) {
            routes = [routes];
        }
        routes.forEach(route => {
            if (!lazy) {
                routeAlive = false;
                this._pages.forEach(page => {
                    if (page._shortRoute === route) {
                        routeAlive = true;
                        page.onMessage && page.onMessage(data);
                    }
                });
            }
            // lazy或页面不存在则存入消息队列
            if (!routeAlive || lazy) {
                this._messages.push({
                    route,
                    data
                });
            }
        });
    }

    _messageQueue(page) {
        if (!this._messages.some(msg => msg.route === page._shortRoute)) return;
        let messages = [];
        this._messages.forEach(msg => {
            if (msg.route === page._shortRoute) {
                page.onMessage && page.onMessage(msg.data);
            } else {
                messages.push(msg);
            }
        });
        this._messages = messages;
    }

    update(page) {
        // onShow时读取缓存的消息
        this._messageQueue(page);
    }

    subscribe(fn) {
        return genericSubscribe(fn, this._subscribers)
    }

    watch(ctx, obj = {}) {  // 由于setData是覆盖式更新,所以没必要递归添加监听
        Object.keys(obj).forEach(key => {
            this.defineReactive(ctx.data, key, ctx.data[key], function (value) {
                obj[key].call(ctx, value);
            })
        })
    }

    computed(ctx, obj = {}) {
        let keys = Object.keys(obj);
        let dataKeys = Object.keys(ctx.data);

        dataKeys.forEach(dataKey => {
            this.defineReactive(ctx.data, dataKey, ctx.data[dataKey])
        });

        let firstComputedObj = keys.reduce((prev, next) => {
            ctx.data.$_computed_target = function () {
                ctx.setData({ [next]: obj[next].call(ctx) });
            }
            prev[next] = obj[next].call(ctx)
            delete ctx.data.$_computed_target;
            return prev
        }, {});

        ctx.setData(firstComputedObj);
    }

    defineReactive(data, key, val, fn) {
        const that = this;
        Object.defineProperty(data, key, {
            configurable: true,
            enumerable: true,
            get: function () {
                if (data.$_computed_target) {
                    that.subs.push(data.$_computed_target)
                }
                return val;
            },
            set: function (newVal) {
                if (newVal === val) return;
                fn && fn(newVal);
                if (that.subs.length) {
                    setTimeout(() => {
                        that.subs.forEach(sub => sub())
                    }, 0);
                }
                val = newVal
            }
        })
    }
}