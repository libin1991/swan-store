# easy-store

参考vuex API为小程序增加状态管理并提供页面间通信接口,**支持watch和computed功能**

###  APi

```
app.store.install(this);    // 注册使用 当前页面连接vuex
         
console.log(this.data.$state.counter); 
console.log(app.store.getter);      // 获取getter

app.store.commit('count', 1);     // 触发同步事件
app.store.dispatch('countAsync', 1).then(() => {   // 触发异步事件
    app.store.setState({
        counter: 955
    });
});

app.store.replaceState({   // 替换store
    counter: 955
});

app.postMessage('other', {   // 跨页面通信，事件总线精简版
    type: 'msg',
    data: 'message from page1'
});

var subscribe = app.store.subscribe((type, state) => {    // 订阅commit日志打印
    console.log(type, state);
});

subscribe();   // 清除subscribe 订阅
```

### 模板取值
> **state和getter前用$**

```html
<view>{{$state.counter}}</view>
<view>{{$state.arr}}</view>
<view>{{$getter.arrLength}}</view>
```


### 使用
```javascript
// app.js
import Store from './easy-store';

const store = new Store({
    state: {
        counter: 0,
        arr: [1, 2, 3, 4, 5, 6, 7]
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
    postMessage: store.postMessage.bind(store)
});

// page1
<view>{{$state.counter}}</view>
<view>{{$state.arr}}</view>
<view>{{$getter.arrLength}}</view>

<view>{{tag}}</view>

<view>{{test2}}</view>    // 计算属性
<view>{{test3}}</view>    // 计算属性


const app = getApp();
Page({data: {
        tag: '测试',
        test: {
            a: 100,
            b: 200
        }
    },
    computed: {   // 计算属性
        test2() {
            return this.data.test.a + 'Test2'
        },
        test3() {
            return this.data.test.b + 'Test3'
        }
    },
    watch: {
        tag(newVal) {
            console.log('test发生变化');
        }
    },
    onLoad() {
    
        app.store.install(this);    // 注册使用 当前页面连接vuex
         
        console.log(this.data.$state.counter); 
        console.log(app.store.getter);      // 获取getter

        app.store.commit('count', 1);
        app.store.dispatch('countAsync', 1).then(() => {
            app.store.setState({
                counter: 955
            });
        });

        app.store.replaceState({
            counter: 955
        });

        app.postMessage('other', {
            type: 'msg',
            data: 'message from page1'
        });
    }
});



// page2
<view>{{$state.counter}}</view>
<view>{{$state.arr}}</view>
<view>{{$getter.arrLength}}</view>


Page({
    onLoad() {
        app.store.install(this);    // 注册使用 
        console.log(this.data.$state.counter);
    },
    onMessage(data) {   // 接受外部通信事件，类似于浏览器postMessage
        console.log(data);
    }
});
```



