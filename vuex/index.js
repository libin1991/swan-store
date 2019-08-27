/*
 * 类似vuex中的接口进行状态管理
 * 利用postMessage和onMessage的方式进行页面间通信
 */

function getShortRoute(route) {
    return route.replace(/^\/?\w+\/(\w+)\/.+/gi, '$1');
}

export default class Store {
    constructor(config) {
        this.state = config.state || {};
        this.mutations = config.mutations || {};
        this.actions = config.actions || {};

        this._pages = [];
        this._messages = [];
    }
    install(page) {
        page._shortRoute = getShortRoute(page.route);
        this._pages.unshift(page);
        this.setState();
    }
    uninstall(page) {
        let index = this._pages.indexOf(page);
        if (index > -1) {
            this._pages.splice(index, 1);
        }
    }
    setState(data) {
        if (typeof data === 'object') {
            Object.assign(this.state, data);
        }
        this._pages.forEach(page => {
            page.setData({
                $state: this.state
            });
        });
    }
    commit(type, payload) {
        let mutation = this.mutations[type];
        let result = mutation && mutation(this.state, payload);
        this.setState();
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
            route = getShortRoute(route);

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
}