const Value = require('Value');

cc.Class({
    extends: cc.Component,

    properties: {
        // 滚动窗节点
        sv1: cc.Node,
        sv2: cc.Node,
        // 标题
        titleLabel: cc.Label,
        // 扩展包
        extend1: cc.Node,
        extend2: cc.Node,
        // 预制按钮
        chooseBtn1: cc.Prefab,
        chooseBtn2: cc.Prefab,
        comingSoon: cc.Prefab,
    },

    onLoad() {
        let self = this;
        // 监听
        this.extend1.on('touchend', this.sv1Touch, this);
        this.extend2.on('touchend', this.sv2Touch, this);
        // 加载数据
        Value.getInstance().loadFile('Tangram', function (data) {
            if (data != null) {
                // 标题
                self.titleLabel.string = data._name;
                // 扩展包名
                self.extend1.getChildByName('Label').getComponent(cc.Label).string = data.json[0].belong;
                self.extend2.getChildByName('Label').getComponent(cc.Label).string = data.json[10].belong;
                // 添加extend选项
                for (var index = 0; index < 20; index++) {
                    let jsonData = data.json[index];
                    if (jsonData == null) {
                        break;
                    }
                    else if (jsonData.belong == 'Base') {
                        self.setChooseBtn(self.sv1, self.chooseBtn1, jsonData);
                    }
                    else if (jsonData.belong == 'Extend') {
                        if (jsonData.level_name == 'Coming Soon!') {
                            let comingbtn = cc.instantiate(self.comingSoon);
                            self.sv2.getChildByName('view').getChildByName('content').addChild(comingbtn);
                            break;
                        }
                        self.setChooseBtn(self.sv2, self.chooseBtn2, jsonData);
                    }
                };
                self.sv1.getComponent(cc.ScrollView).scrollToTop(0.1);
                self.sv2.getComponent(cc.ScrollView).scrollToTop(0.1);
            }
            else {
                cc.log('Difficulty的载入数据为空!');
            }
        });
    },

    // 标签切换效果
    sv1Touch() {
        if (this.sv1.active == false) {
            this.sv1.active = true;
            this.sv2.active = false;
            this.extend1.color = new cc.color(245, 245, 245);
            this.extend2.color = new cc.Color(227, 227, 227);
        }
    },
    sv2Touch() {
        if (this.sv2.active == false) {
            this.sv1.active = false;
            this.sv2.active = true;
            this.extend2.color = new cc.color(245, 245, 245);
            this.extend1.color = new cc.Color(227, 227, 227);
        }
    },

    // 生成按钮并设置参数 extend:ScrollView对象 btn:按钮预制体对象
    setChooseBtn(extend, btn, jsonData) {
        let extendContent = extend.getChildByName('view').getChildByName('content');
        let object = cc.instantiate(btn);
        // 按钮颜色
        let color = new cc.Color();
        object.color = color.fromHEX(jsonData.color);
        // 按钮标题
        object.getChildByName('Label').getComponent(cc.Label).string =
            jsonData.level_name + '\n' + jsonData.have_round + '/' + jsonData.round;
        // 解锁关卡
        if (jsonData.active == true) {
            object.getChildByName('dark_bg').active = false;
        }
        // 价格
        else {
            object.getChildByName('dark_bg').getChildByName('Label').getComponent(cc.Label).string = jsonData.price;
        };
        // 激活奖章
        if (jsonData.have_round == jsonData.round) {
            object.getChildByName('medal_bg').getChildByName('medal').active = true;
        };
        extendContent.addChild(object);
    }
});