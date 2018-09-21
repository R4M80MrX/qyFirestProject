cc.Class({
    extends: cc.Component,

    properties: {
    },

    // 震屏效果
    // 参数：duration 震屏时间
    shakeEffect: function (duration) {
        this.node.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.moveTo(0.02, cc.p(5, 7)),
                    cc.moveTo(0.02, cc.p(-6, 7)),
                    cc.moveTo(0.02, cc.p(-13, 3)),
                    cc.moveTo(0.02, cc.p(3, -6)),
                    cc.moveTo(0.02, cc.p(-5, 5)),
                    cc.moveTo(0.02, cc.p(2, -8)),
                    cc.moveTo(0.02, cc.p(-8, -10)),
                    cc.moveTo(0.02, cc.p(3, 10)),
                    cc.moveTo(0.02, cc.p(0, 0))
                )
            )
        );

        setTimeout(() => {
            this.node.stopAllActions();
            this.node.setPosition(0, 0);
        }, duration * 1000);
    },
});
