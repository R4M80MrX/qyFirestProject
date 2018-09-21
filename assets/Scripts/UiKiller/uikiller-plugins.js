let uikiller = require('./uikiller');
const UIKillerBindFilter = {
    name: 'UIKillerBindFilter',
    onCheckNode(node, target) {
        if (node === target.node) {
            return true;
        }

        let options = target.$options;
        if (uikiller.isFunction(options.filter)) {
            if (options.filter(node)) {
                return false;
            }
        }

        if (node.name[0] === '@') {
            return false;
        }
    }
};

const LANGUAGE_TABLE = {
    hello: '你好XXX',
    world: '世界',
    '1': 'hellddo',
    '2': 'wrold',
}
const UIKillerLabelLanguage = {  
    name: 'UIKillerLabelLanguage',
    onCheckNode(node, target) {
        let label = node.getComponent(cc.Label);
        if (!label) {
            return;
        }
        let key = node.$ || node.name;
        let str = LANGUAGE_TABLE[key];
        if (str) {
            label.string = str;
        }
    }
};

const SOUND_CONFIG = {
    //_attack_ab: '3002.mp3',
    //_expedition: '3006.mp3', 
    click: 'click.mp3',      
}
const UIKillerTouchSound = {
    name:'UIKillerTouchSound',
    /**
     * 
     * @param {*} node 
     * @param {*} event 
     * @param {*} hasEventFunc 
     * @param {*} eventResult 
     */
    onAfterHandleEvent(node, event, hasEventFunc, eventResult) {
        if (window.canPlayEffects == false  || event.type !== cc.Node.EventType.TOUCH_END || eventResult === false) {
            return;
        }
        
        let soundName = SOUND_CONFIG[eventResult] || SOUND_CONFIG[node.name] || SOUND_CONFIG.click;
        //AudioManager.playEffect(soundName);
    }
};

const UIKillerToggleDispose = {
    name:'UIKillerToggleDispose',
    /**
     * 
     * @param {*} node 
     * @param {*} event 
     * @param {*} hasEventFunc 
     * @param {*} eventResult 
     */
    //处理复选框 
    onCheckNode(node, event, hasEventFunc, eventResult) {
        let toggle = node.getComponent(cc.Toggle);
        if (!toggle) {
            return;
        }

        toggle._updateCheckMark = function()
        {
            if (this.checkMark) {
                this.checkMark.node.active = !!this.isChecked;
            }

            let group = this.toggleGroup || this._toggleContainer;
            if (!group || !group.enabled)
            {
                this.target.active = !this.isChecked;
            }
        };
        

    }
};

uikiller.registerPlugin(UIKillerToggleDispose);
uikiller.registerPlugin(UIKillerBindFilter);
uikiller.registerPlugin(UIKillerLabelLanguage);
uikiller.registerPlugin(UIKillerTouchSound);