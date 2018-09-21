var Value = cc.Class({
    extends: cc.Component,

    properties: {
    },

    statics: {
        instance: null,
        chooseData: {
            GameNme: null,
            LevelName: null,
            RoundName: null,
            RoundNum: null,
            HaveRound: null,
            PopupType: '',
            PopupObject: null,
        },
        data: null
    },

    // 加载文件数据
    loadFile(fileName, callback) {
        cc.loader.loadRes(fileName + ".json", function (err, object) {
            if (err) {
                cc.log(err);
            };

            var data = object;
            Value.data = data;
            if (callback) {
                callback(data);
            }
        });
    },
});

Value.getInstance = function () {
    if (!Value.instance) {
        Value.instance = new Value();
    }
    return Value.instance;
};

module.exports = Value;