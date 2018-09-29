const Value = require('Value');
const Player = require('Player');

let Thor = require('Thor');

cc.Class({
    extends: Thor,

    properties: {
    },

    onLoad() {
    },
    _onTouchEnd() {
        let self = this;
        // 取按钮名称
        let name = self.node.name;
        let chooseData = Value.chooseData;
        if (name == 'AddGoldBtn') {
            // 切换至商店
        }
        // 后退按钮
        else if (name == 'BackBtn') {
            let scene = cc.director.getScene();
            if (scene.name == 'Round') {
                cc.director.loadScene('Difficulty');
            }
            else if (scene.name == 'Difficulty') {
                cc.director.loadScene('Home');
            }
        }
        else if (name == 'HelpBtn') {
            // 接入微信
        }
        else if (name == 'HomeBtn') {
            // 切换至大厅
        }
        else if (name == 'MenuBtn') {
            // 弹出选项菜单
        }
        // 提示
        else if (name == 'RemindBtn') {
            // 扣除金币
            let isReduce = Player.getInstance().reduceGold();
            if (isReduce) {
                // 金币足够 放置碎片
            }
            else {
                // 金币不足 切换至商店
            }
        }
        // 重新开始
        else if (name == 'ReplayBtn') {
            let gameScene = cc.director.getScene();
            if (gameScene.name == 'Tangram') {
                gameScene.children[0].getComponent('Tangram').rePlay();
            }
        }
        else if (name == 'Reward_darkBtn') {
            // 弹出条件页面
        }
        else if (name == 'Reward_lightBtn') {
            // 弹出领取页面
        }
        // 切换至选择游戏关卡页面
        else if (name == 'ChooseBtn1' || name == 'ChooseBtn2') {
            let darkBg = self.node.getChildByName('dark_bg');
            // 已解锁 加载
            if (darkBg.active == false) {
                let str = self.getComponentForName(self.node, 'Label', cc.Label).string;
                chooseData.LevelName = str.split('\n')[0];
                chooseData.RoundNum = parseInt(str.split('/')[1]);
                chooseData.HaveRound = parseInt(str.match((/[0-9]+/))[0]);
                cc.director.loadScene('Round');
            }
            // 未解锁 弹窗
            else {
                chooseData.UnlockObject = self.node;
                chooseData.PopupTitle = 'Unlock';
                cc.loader.loadRes('prefab/Popup', function (err, prefab) {
                    let st = self.getComponentForName(self.node, 'Label', cc.Label).string;
                    chooseData.LevelName = st.split('\n')[0];
                    chooseData.PopupObject = cc.instantiate(prefab);
                    let up = chooseData.PopupObject.getChildByName('up');
                    // 弹窗标题
                    let title = up.getChildByName('Title');
                    self.getComponentForName(title, 'Label', cc.Label).string = chooseData.PopupTitle;

                    // 弹窗内解锁的对象
                    let selfNode = cc.instantiate(self.node);
                    let str = self.getComponentForName(selfNode, 'Label', cc.Label).string.split('\n')[0];
                    selfNode.getComponent(cc.Button).interactable = false;

                    // 弹窗文字内容
                    let content = up.getChildByName('Content');
                    self.getComponentForName(content, 'Message1', cc.RichText).string =
                        self.richText('You need', '150', 'to lock') + '<color=#797979>' + str + '</c>';
                    content.addChild(selfNode);

                    // 弹窗确定按钮文字
                    let confirm = self.getSecondChild(up, 'Btn', 'Confirm');
                    self.getComponentForName(confirm, 'Label', cc.Label).string = 'OK';
                    cc.director.getScene().addChild(chooseData.PopupObject);
                });
            }
        }
        // 切换至游戏界面
        else if (name == 'RoundBtn') {
            chooseData.RoundNum = self.getComponentForName(self.node, 'Label', cc.Label).string;
            cc.loader.loadRes(chooseData.GameName + '-' + chooseData.LevelName + '-' + chooseData.RoundNum + '.json',
                function (err, object) {
                    if (object != null) {
                        Value.data = object.json;
                        Value.picNum = object.json.level;
                        cc.director.loadScene(chooseData.GameName);
                    }
                    else {
                        cc.log(chooseData.GameName + '-' + chooseData.LevelName
                            + '-' + chooseData.RoundNum + '关卡数据为空!');
                    }
                }
            );
        }
        // 弹窗取消按钮
        else if (name == 'Cancel') {
            chooseData.PopupObject.destroy();
        }
        // 弹窗确定按钮
        else if (name == 'Confirm') {
            let popUp = this.node.parent.parent;
            let label = this.getSecondChild(popUp, 'Title', 'Label').getComponent(cc.Label);
            // 解锁难度
            if (label.string == 'Unlock') {
                let jsonData = Value.data.json;
                for (var index = 0; index < 20; index++) {
                    if (jsonData[index] == null) {
                        break;
                    }
                    // 解锁扣金币
                    else if (chooseData.LevelName == jsonData[index].level_name) {
                        let isReduce = Player.getInstance().reduceGold(150);
                        // 金币足够 解锁关卡
                        if (isReduce) {
                            let key = chooseData.GameName + '-' + chooseData.LevelName;
                            let gameData = JSON.parse(cc.sys.localStorage.getItem(key));
                            gameData.active = true;
                            cc.sys.localStorage.setItem(key, JSON.stringify(gameData));
                            chooseData.UnlockObject.getChildByName('dark_bg').active = false;
                        }
                        // 金币不足 跳转至商店
                        else {

                        }
                    }
                }
            }
            // 加载下一关
            else if (label.string == 'Win') {
                let chooseData = Value.chooseData;
                chooseData.RoundNum++;
                cc.director.loadScene(chooseData.GameName);
                cc.loader.loadRes(chooseData.GameName + '-' + chooseData.LevelName + '-' + chooseData.RoundNum + '.json',
                    function (err, object) {
                        if (object != null) {
                            Value.data = object.json;
                            Value.picNum = object.json.level;
                            cc.director.loadScene(chooseData.GameName);
                        }
                        else {
                            cc.log(chooseData.GameName + '-' + chooseData.LevelName
                                + '-' + chooseData.RoundNum + '关卡数据为空!');
                        }
                    }
                );
            }
            chooseData.PopupObject.destroy();
        }
    },

    // target：目标, name：子节点名称, Component：要获取的组件
    getComponentForName(target, name, Component) {
        let object = target.getChildByName(name).getComponent(Component);
        return object;
    },

    // target：目标, name：子节点名称
    getSecondChild(target, name1, name2) {
        let object = target.getChildByName(name1).getChildByName(name2);
        return object;
    },

    // 富文本
    richText(string1, goldNum, string2) {
        let text = '<color=#797979>' + string1 + ' </c>' + '<color=#FFC200>' + goldNum + '</c>' +
            '\n<color=#797979>' + string2 + ' </c>';
        return text;
    },
});
