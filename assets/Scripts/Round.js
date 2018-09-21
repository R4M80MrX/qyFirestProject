const Value = require('Value');

cc.Class({
    extends: cc.Component,

    properties: {
        roundBtn: cc.Prefab,
        title: cc.Node,
        content: cc.Node,
        scrollView: cc.Node,
    },
    onLoad() {
        // 标题
        this.title.getComponent(cc.Label).string = Value.chooseData.LevelName;
        // 添加关卡
        for (var index = 1; index <= Value.chooseData.RoundNum; index++) {
            let object = cc.instantiate(this.roundBtn);
            object.getChildByName('Label').getComponent(cc.Label).string = index;
            this.content.addChild(object);
            if (index == Value.chooseData.HaveRound + 1) {
                object.getChildByName('mark').active = true;
            }
            else if (index > Value.chooseData.HaveRound) {
                let color = new cc.Color();
                object.color = color.fromHEX('#C3BDB6');
                object.getComponent(cc.Button).interactable = false;
            };
        };
    },

    start() {
        this.scrollView.getComponent(cc.ScrollView).scrollToTop(0.1);
    }
});
