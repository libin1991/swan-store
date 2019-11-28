import Store from './index';
export default new Store({
    state: {
        counter: 0,
        num: 110,
        arr: [1, 2, 3, 4, 5, 6, 7],
        test: []
    },
    mutations: {
        count(state, payload) {
            return state.counter += payload;
        },
        count1(state, payload) {
            return state.num += payload;
        },
        addarr(state, payload) {
            return state.test = payload;
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