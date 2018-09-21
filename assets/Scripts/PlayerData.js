const Value = require('Value');

//存放玩家基本数据 金币 关卡数据
var PlayerInfo = "PlayerInfo";
var PlayerRound = "PlayerRound";

var PlayerInfo = cc.Class({
    properties: {
        player_level: '',
        player_gold: '',
    }
});

var PlayerRound = cc.Class({
    properties: {
        player_level: '',
        player_gold: '',
    }
});

var PlayerManager = cc.Class({
    properties: {
    },

    ctor() {
        this.loadData();
    },
    loadData() {

        var val = LocalDataManager.read(UserDefault_PlayerInfo, null);
        if (val != null) {
            this.player_info = JSON.parse(val);
        }
        else {
            this.player_info = new PlayerInfo();
        }
    },
    saveData() {
        LocalDataManager.write(UserDefault_PlayerInfo, JSON.stringify(this.player_info));
    },
    //金币
    haveGold(gold) {
        return this.player_info.gold >= Math.floor(gold);
    },
    addGold(gold) {
        this.player_info.gold += Math.floor(gold);
        this.saveData();
    },
    getGold() {
        return this.player_info.gold;
    },
    //分数
    getMaxScore() {
        return this.player_info.max_score;
    },
    setMaxScore(score) {
        this.player_info.max_score = Math.max(this.player_info.max_score, score);
        this.saveData();
    },
    //广告
    purchaseNoAdsSuccsee() {
        this.player_info.is_no_ads = true;
    },
    isNoAds() {
        return this.player_info.is_no_ads;
        //return true;
    },
    getPlayerInfo() {
        return this.player_info;
    },

});

PlayerManager._instance = null;

PlayerManager.getInstance = function () {

    if (!PlayerManager._instance) {
        PlayerManager._instance = new PlayerManager();
    }

    return PlayerManager._instance;
}

module.exports = PlayerManager;