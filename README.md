# easy-store
参考vuex为小程序增加状态管理并提供页面间通信接口

## 使用
```javascript
// app.js
import Store from './easy-store';

const store = new Store({
    state: {
        counter: 0,
    },
    mutations: {
        count(state, payload) {
            return state.counter += payload;
        },
    },
    actions: {
        countAsync(store, payload) {
            return new Promise(resolve => {
                setTimeout(() => {
                    store.commit('count', payload);
                    resolve();
                }, 2000);
            });
        },
    }
});

App({
    store,
    // 简化postMessage调用
    postMessage: store.postMessage.bind(store)
});

// page1
<view>{{$state.counter}}</view>

const app = getApp();
Page({
    onLoad() {
    
        app.store.install(this);    // 注册使用 
         
        console.log(this.data.$state.counter);

        app.store.commit('count', 1);
        app.store.dispatch('countAsync', 1).then(() => {
            app.store.setState({
                counter: 955
            });
        });

        app.postMessage('page2', {
            type: 'msg',
            data: 'message from page1'
        });
    }
});

// page2
<view>{{$state.counter}}</view>

Page({
    onLoad() {
        app.store.install(this);    // 注册使用 
        console.log(this.data.$state.counter);
    },
    onMessage(data) {
        console.log(data);
    }
});
```
