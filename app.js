
App({
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
