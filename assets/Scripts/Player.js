var PlayerData = {
    level: 0,
    exp: 0,
    gold: 0,
};

var Player = cc.Class({
    properties: {
    },
    // 检测玩家数据 
    ctor() {
        if (!this._readData()) {
            this.player_data = Object.assign({}, PlayerData);
            this._saveData();
        }
    },
    // 读取数据
    _readData() {
        this.player_data = JSON.parse(cc.sys.localStorage.getItem('PlayerData'));
        return this.player_data;
    },
    // 保存数据
    _saveData() {
        cc.sys.localStorage.setItem('PlayerData', JSON.stringify(this.player_data));
    },
    // 显示金币
    showGold() {
        return this._readData().gold;
    },
    // 加金币
    addGold(num) {
        this._readData().gold += num;
        this._saveData();
    },
    // 扣金币
    reduceGold(num) {
        if ((this._readData().gold -= num) < 0) {
            cc.log('钱不够');
            return false;
        }
        else {
            this._readData().gold -= num;
            this._saveData();
            return true;
        }
    },
    // 加经验
    expUp() {
        this.player_data.exp += 20;
        let maxExp = (this.player_data.level + 1) * 50;
        if (this.player_data.exp >= maxExp) {
            this.player_data.level++;
        }
        this._saveData();
    }
});

Player.instance = null;

Player.getInstance = function () {
    if (!Player.instance) {
        Player.instance = new Player();
    }
    return Player.instance;
};

module.exports = Player;