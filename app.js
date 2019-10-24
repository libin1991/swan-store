import Store from './vuex/index';
const store = new Store({
    state: {
        counter: 0,
        num: 110,
        arr: [1, 2, 3, 4, 5, 6, 7]
    },
    mutations: {
        count(state, payload) {
            return state.counter += payload;
        },
        count1(state, payload) {
            return state.num += payload;
        },
        addarr(state, payload) {
            return state.arr.push(payload);
        },
    },
    actions: {
        countAsync(store, payload) {
            return new Promise(resolve => {
                setTimeout(() => {
                    store.commit('count1', payload);
                    resolve();
                }, 1000);
            });
        },
    },
    getters: {
        arrLength: (state) => {
            return state.arr.length;
        }
    }
});






App({
    store,
    // 简化postMessage调用
    postMessage: store.postMessage.bind(store),
    globalData: {
        name: '百度小程序',
        version: 12.01,
        mob: 'ios',
        arr: [1]
    },
    onLaunch(options) {
        // console.log(options);
        // console.log(this);
        if (swan.canIUse('showFavoriteGuide')) {
            swan.showFavoriteGuide({
                type: 'bar',
                content: '一键添加到我的小程序',
                success(res) {
                    console.log('添加成功：', res);
                },
                fail(err) {
                    console.log('添加失败：', err);
                }
            });
        }
    },
    onShow(options) {
        // console.log(1);
    },
    onHide() {
        // console.log(222);
    }
});
