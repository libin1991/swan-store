const app = getApp()
const My = require('my.js');
import Store from '../../store/swan-store';


console.log(Store);

Page({
    data: {
        number: 0,
        name: 'SWAN',
        userInfo: {},
        hasUserInfo: false,
        canIUse: swan.canIUse('button.open-type.getUserInfo'),

        items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        flag: true,
        person: { name: 'Lebron James', pos: 'SF', age: 33 },
        teams: ['Cleveland Cavaliers', 'Miami Heat', 'Los Angeles Lakers'],


        tag: 'basketball',
        test: {
            a: 100,
            b: 200
        }
    },
    computed: {
        test2() {
            return this.data.test.a + 'Test2'
        },
        test3() {
            return this.data.test.b + 'Test3'
        }
    },
    watch: {
        test(newVal) {
            console.log('test发生变化', newVal);

        }
    },
    onLoad() {
        Store.install(this);
        var i = 0;
        var a = Store.subscribe((type, state) => {
            i++;
            console.log(type, state);
            console.log(i);
            // if (i > 3) a();
        });


        // a();

        // console.log(this.data);
        // console.log(app);
        // 监听页面加载的生命周期函数
        // console.log(getCurrentPages()); // [{...}]
        // console.log(My.B(100, 9));


    },
    loadMore(e) {
        const a = '$' + Math.random(0, 1);
        const b = '$' + Math.random(0, 1);
        Store.commit('addarr', [a, b]);
        this.setData({
            test: {
                a,
                b
            },
            tag: Math.random(0, 1)
        });

        // console.log(this.data.$state.counter);
        // console.log(this.data);
        //Store.commit('addarr', 1);
        //Store.dispatch('countAsync', 5);
        // console.log(Store);
        // console.log(Store.getter);
        // Store.replaceState({
        //     counter: 955
        // });

        // Store.setState({
        //     counter: 955
        // });

        // setTimeout(() => {
        //     app.postMessage('other', {
        //         type: 'msg',
        //         data: 'message from page1'
        //     });
        // }, 2000);

        console.log(this);
        console.log('加载更多被点击');
        console.log(app);
        console.log(this.getData('items'));
        this.setData({
            // items: [...this.data.items, 123],
            flag: !this.data.flag
        }, () => {
            console.log(swan);
            // this.doSth();
        })
    },
    onTabItemTap(item) {
        // console.log(item.index);
        // console.log(item.pagePath);
        // console.log(item.text);
    },
    onPullDownRefresh() {
        console.log(122);
        setTimeout(() => {
            swan.stopPullDownRefresh(300);
        }, 2000)
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            console.log(res.target); // 来自页面内转发按钮
        }
        return {
            title: '智能小程序示例',
            content: '世界很复杂，百度更懂你',
            path: '/pages/openShare/openShare?key=value'
        };
    },
    getUserInfo(e) {
        swan.login({
            success: () => {
                swan.getUserInfo({
                    success: (res) => {
                        this.setData({
                            userInfo: res.userInfo,
                            hasUserInfo: true
                        });
                    },
                    fail: () => {
                        this.setData({
                            userInfo: e.detail.userInfo,
                            hasUserInfo: true
                        });
                    }
                });
            },
            fail: () => {
                swan.showModal({
                    title: '未登录',
                    showCancel: false
                });
            }
        });
    },
    doSth() {
        //this.setData({ number: 1 }) // 直接在当前同步流程中执行
        app.globalData.arr = [1, 2, 3, 4, 5, 6];
        swan.nextTick(() => {
            this.setData({ number: 3 }) // 在当前同步流程结束后，下一个时间片执行
            console.log(app);
        });

        // this.setData({ number: 2 }) // 直接在当前同步流程中执行
    },
    previewImage() {
        swan.previewImage({
            current: 'https://b.bdstatic.com/miniapp/image/swan-preview-image-zip.png',// current需与urls中链接一致
            urls: ['https://b.bdstatic.com/miniapp/image/swan-preview-image-zip.png', 'http://ppic.meituba.com:84/uploads/allimg/2016/08/30/38_2760.jpg'],
            images: [
                {
                    "url": 'https://b.bdstatic.com/miniapp/image/swan-preview-image-zip.png',
                    "origin_url": 'https://b.bdstatic.com/miniapp/image/swan-preview-image-origin.png'
                }
            ],
            success: res => {
                console.log('previewImage success', res);
            },
            fail: err => {
                console.log('previewImage fail', err);
            }
        });
    },
    viewImg(e) {
        console.log(e);
    },
    jump() {
        swan.navigateTo({
            url: '/pages/other/index'
        });
    }
})
