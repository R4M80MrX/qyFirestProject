//对应ActionDefine的组件, 能快速在编辑器上直接调试动作,同时可直接在onenable显示动作 减少代码量
let GameEnum = require("GameEnum")
let ActionDefine = require("ActionDefine")

//提供编辑模式下预览 该部分基本不用动
var action_Component = cc.Class({
    extends: cc.Component,
    editor: {
        executeInEditMode: true,
        playOnFocus: true,
    },
    properties: {
        show_on_start: false,
        show_on_enable: false,
        action_tag: 0,
        show_config: false,
        _action_enum: {
            default: ActionDefine.ActionEnum.null_action,
            type: ActionDefine.ActionEnum,
            visible: false,
        },
        action_enum: {
            type: ActionDefine.ActionEnum,
            get: function () {
                return this._action_enum;
            },
            set: function (val) {
                if (this._action_enum == val) return;
                this._action_enum = val;

                this.resetProperties();
            }
        },

        _action_config_json: "",
        editor_show: {
            default: false,
            tooltip: "编辑状态下预览效果",
            notify: function () {
                if (CC_EDITOR) {
                    if (this.editor_show) {
                        this.editorSavaNodeData();
                        this.showAction();
                    }
                    else {
                        this.onLostFocusInEditor();
                    }
                }
            }
        },

        action_config_class: {
            default: null,
            type: ActionDefine.ActionClassDefine.ActionClassBase,
            visible() {
                return this.show_config && this.isUseActionClass();
            }
        },
        actoin_config: {
            default: null,
            notify() {
                //action 直接使用类定义的时候 不处理

                if (!this.isUseActionClass()) {
                    if (this.actoin_config) {
                        this._action_config_json = JSON.stringify(this.actoin_config);
                    }
                    else {
                        this._action_config_json = "";
                    }
                }
            },
            visible() { return this.show_config && !this.isUseActionClass(); }
        },

    },
    onLoad() {
        if (CC_EDITOR && !this.isUseActionClass()) {
            // cc.log(this._action_config_json);
            if (this._action_config_json) {
                let config = JSON.parse(this._action_config_json);
                for (let key in config) {
                    if (config[key]) {
                        if (config[key].x !== undefined && config[key].y !== undefined) {
                            config[key] = cc.v2(config[key].x, config[key].y);
                        }

                        if (config[key].width !== undefined && config[key].height !== undefined) {
                            config[key] = new cc.Size(config[key].width, config[key].height);
                        }
                    }
                }
                this.resetProperties(config);

            }
        }

        if (!CC_EDITOR && this.isOnLoadShow()) {
            this.showAction();
        }
    },
    isOnLoadShow() {
        if (this.isUseActionClass()) {
            return this.action_config_class.is_onload;
        }
        else {
            return this.actoin_config.is_onload;
        }

        return false;
    },
    onEnable() {
        if (!CC_EDITOR && this.show_on_enable) {
            this.showAction();
        }
    },
    start() {
        if (!CC_EDITOR && this.show_on_start) {
            this.showAction();
        }
    },
    isUseActionClass() {
        let enum_name = GameEnum.getEnumName(ActionDefine.ActionEnum, this.action_enum);
        return ActionDefine.ActionClassDefine && ActionDefine.ActionClassDefine[enum_name] !== undefined;
    },
    showAction(action_node = null, end_func = null) {
        action_node = action_node ? action_node : this;
        if (this.isUseActionClass()) {
            ActionDefine.doCommonAction(action_node, this.action_enum, this.action_config_class, end_func);
        }
        else {
            ActionDefine.doCommonAction(action_node, this.action_enum, this.actoin_config, end_func);
        }
    },
    getConfig() {
        if (this.isUseActionClass()) {
            return this.action_config_class;
        }
        else {
            return this.actoin_config;
        }
    },
    resetProperties(config = null) {
        this.onLostFocusInEditor();

        let action_name = "ActionEnum." + GameEnum.getEnumName(ActionDefine.ActionEnum, this.action_enum);

        config = config ? config : ActionDefine.getActionConfig(this.action_enum);

        this.action_config_class = null;
        if (this.isUseActionClass()) {
            this.action_config_class = new config();
        }
        else {
            let newClass = cc.Class({
                properties: config
            });
            this.actoin_config = new newClass();
        }
    },
    onLostFocusInEditor() {
        if (CC_EDITOR) {
            this.editorLoadNodeData();
        }
    },
    editorSavaNodeData() {
        this.have_data = true;
        this.node_data = {};
        this.node_data.scaleX = this.node.scaleX;
        this.node_data.scaleY = this.node.scaleY;
        this.node_data.position = this.node.getPosition();
        this.node_data.contentSize = this.node.getContentSize();
        this.node_data.rotation = this.node.rotation;
        this.node_data.opacity = this.node.opacity;
    },
    editorLoadNodeData() {
        if (this.have_data) {
            this.node.stopAllActions();

            this.have_data = false;
            this.node.setScale(this.node_data.scaleX, this.node_data.scaleY);
            this.node.setPosition(this.node_data.position);
            this.node.setContentSize(this.node_data.contentSize);
            this.node.rotation = this.node_data.rotation;
            this.node.opacity = this.node_data.opacity;
        }

        if (this.editor_show === true) {
            this.editor_show = false;
        }
    },
});