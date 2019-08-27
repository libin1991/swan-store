const app = getApp();
Page({
    onMessage(data) {
        console.log(data);
    },
    onLoad() {
        app.store.install(this);
        console.log(this.data.$state.counter);

        return;
        swan.getSystemInfo({
            success: res => {
                // 更新数据
                console.log(res);
            },
            fail: err => {
                swan.showToast({
                    title: '获取失败'
                });
            }
        });
    },
    previewImage() {
        swan.previewImage({
            current: 'https://smartprogram.baidu.com/docs/img/design/overview/1-1.png', // 当前显示图片的http链接
            urls: ['https://smartprogram.baidu.com/docs/img/design/overview/1-1.png', 'https://smartprogram.baidu.com/docs/img/design/overview/1-2.png'], // 需要预览的图片http链接列表
            success: function (res) {
                console.log('previewImage success', res);
            },
            fail: function (err) {
                console.log('previewImage fail', err);
            }
        });
    },
    previewOriginImage() {
        swan.previewImage({
            urls: ['https://b.bdstatic.com/searchbox/icms/searchbox/img/swan-preview-image.jpg', 'https://b.bdstatic.com/searchbox/icms/searchbox/img/swan-preview-image-2.png'], // 需要预览的图片http链接列表
            images: [
                {
                    "url": 'https://b.bdstatic.com/searchbox/icms/searchbox/img/swan-preview-image.jpg', //图片预览链接
                    "origin_url": 'https://b.bdstatic.com/searchbox/icms/searchbox/img/swan-preview-image-origin.jpg' //图片的原图地址
                },
                {
                    "url": "https://b.bdstatic.com/searchbox/icms/searchbox/img/swan-preview-image-2.png",//图片预览链接
                    "origin_url": "https://b.bdstatic.com/searchbox/icms/searchbox/img/swan-preview-image-2-origin.png"  //图片的原图地址
                }
            ],
            success: function (res) {
                console.log('previewImage success', res);
            },
            fail: function (err) {
                console.log('previewImage fail', err);
            }
        });
    }
});