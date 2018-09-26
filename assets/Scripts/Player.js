var Player = cc.Class({
    extends: cc.Component,
    properties: {
    },

    statics: {
        instance: null,
    },

    saveData(key, value) {
        cc.sys.localStorage.setItem(key, value);
    },

    loadData(key) {
        return JSON.parse(cc.sys.localStorage.getItem(key));
    },
});

Player.getInstance = function () {
    if (!Player.instance) {
        Player.instance = new Player();
    }
    return Player.instance;
};

module.exports = Player;