
//通用公用Action  使用勿用-1来延展enum 之后修改的话会错误
//可通过CommonAction组件来快速使用和调试
//该出标识已使用到第几号enum
// 30
let GameDefine = require("./GameDefine")

const ActionEnum = cc.Enum({
    null_action: 0,
    clockwise_rotation: 1,//顺时针旋转
    randspeed_clockwise_ratation: 2,//范围内随机速度
    rand_rotation: 3,//范围内随机角度
    warning_blink: 4,//警告闪烁

    delay_pos_to: 5, //延迟设置位置
    star_display: 6, // 星星显示
    img_jelly: 9,//果冻持续抖动
    turntable_rotate: 12,//转盘旋转
    move_and_fadeout: 21,//移动后消失
    fast_shake: 22,//快速震动
    jump_to: 23,//跳跃至
    scale_to: 24,//大小变化    
    repeat_jump: 25, //不断跳跃
    move_to: 28, //移动至
    delay_distroy: 29,//延迟移除

    scene_fade_show: 26, //场景渐变显示
    scene_fade_hide: 27, //场景渐变隐藏
    physics_sync_time: 10,//持续时间内 更新物理节点位置

    delay_addeffect: 11,//延迟添加效果到指定节点    
    setting_localZOrder: 30,//设置localZorder

    ///////////////////////
    //对话框的定义
    UIShow_scaleChange: 7,//通过scale变化弹出(对话框用)
    UIClose_scaleChange: 8,//通过scale变化关闭(对话框用)
    UIShow_SweetAlert: 13,//中间扩散
    UIClose_SweetAlert: 14,
    UIShow_LayerFadeChange: 15,//中间扩散渐入
    UIClose_LayerFadeChange: 16,
    UIShow_Spread: 17,//伸缩扩展
    UIClose_Spread: 18,
    UIShow_Fade: 19,//渐变
    UIClose_Fade: 20,
});

//有node一类绑定需求的 需要定义对应类来实现
var ActionClassDefine = {};
ActionClassDefine.ActionClassBase = cc.Class({
    name: "ActionClassBase",
    properties: {

    }
});

var getActionConfig = function (action_enum) {
    return doCommonAction(null, action_enum, null, null, true) || {};
};

var stopActionByEnum = function (target, action_enum) {
    let node = (target && target.node) ? target.node : target;
    if (node != null) {
        node.stopActionByTag(action_enum);
    }
}

var hasActionByEnum = function (target, action_enum) {
    let node = (target && target.node) ? target.node : target;
    if (node != null) {
        return !!node.getActionByTag(action_enum);
    }

    return false;
}
var defaultFunc = function () { }
var doCommonAction = function (
    target,
    action_enum,
    config = null, //为null时默认
    end_func = null, //
    get_config = false,//合并getActionConfig 
) {
    let action = null;
    let node = (target && target.node) ? target.node : target;
    if (node == null && !get_config) {
        return;
    }

    if (!get_config && !config) {
        config = getActionConfig(action_enum);
    }

    if (config) {
        config.end_func = config.end_func || end_func;
    }

    switch (action_enum) {
        case ActionEnum.clockwise_rotation://顺时针旋转
            {
                if (get_config) {
                    return {
                        repeat: 1,
                        b_repeat_forever: true,
                        rotation: 360,
                        time: 2,

                        end_func: null,
                    };
                }

                if (config.b_repeat_forever) {
                    action = node.runAction(cc.repeatForever(cc.rotateBy(config.time, config.rotation)));
                }
                else {
                    action = node.runAction(cc.sequence(
                        cc.repeat(cc.rotateBy(config.time, config.rotation), config.repeat),
                        cc.callFunc(config.end_func || defaultFunc, target)
                    ));
                }

            } break;
        case ActionEnum.randspeed_clockwise_ratation://范围内随机速度
            {
                if (get_config) {
                    return {
                        repeat: 1,
                        b_repeat_forever: true,
                        rotation: 360,
                        time_1: 2,
                        time_2: 4,

                        end_func: null,
                    };
                }

                var time = Math.random() * (config.time_2 - config.time_1) + config.time_1;
                if (config.b_repeat_forever) {
                    action = node.runAction(cc.repeatForever(cc.rotateBy(time, config.rotation)));
                }
                else {
                    action = node.runAction(cc.sequence(
                        cc.repeat(cc.rotateBy(time, config.rotation), config.repeat),
                        cc.callFunc(config.end_func || defaultFunc, target)
                    ));
                }
            } break;
        case ActionEnum.rand_rotation:
            {
                if (get_config) {
                    return {
                        min_rotate: -20,
                        max_rotate: 20,
                    }
                }

                let rotate = Math.random() * (config.max_rotate - config.min_rotate) + config.min_rotate;
                node.rotation = rotate;
            } break;
        case ActionEnum.warning_blink:
            {
                if (get_config) {
                    return {
                        interval: 1,
                        begin_opacity: 128,
                        end_opacity: 255,
                    }
                }

                stopActionByEnum(node, action_enum);
                {
                    node.opacity = config.begin_opacity;
                    action = node.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(config.interval / 2, config.end_opacity), cc.fadeTo(config.interval / 2, config.begin_opacity))));
                }
            } break;
        case ActionEnum.img_jelly:
            {

            } break;
        case ActionEnum.turntable_rotate:
            {
                if (get_config) {
                    return {
                        begin_rorate: 0,
                        rotate_round_min: 10,
                        rotate_round_max: 15,
                        end_rotate: 100,

                        time: 5,
                        end_func: null,
                    };
                }

                config.begin_rorate = GameDefine.rotateIn0_360(config.begin_rorate);
                config.end_rotate = GameDefine.rotateIn0_360(config.end_rotate);
                let round = GameDefine.getRandNumber(config.rotate_round_min, config.rotate_round_max);

                node.rotation = config.begin_rorate;

                let rotate = round * 360 + (360 - config.begin_rorate) + config.end_rotate;

                let time1 = 1;
                let time3 = Math.random() * 0.5 + 2.5;
                let time2 = config.time - time3;

                let rotate1 = 270;
                let rotate3 = Math.random() * 360 + 360;
                let rotate2 = rotate - rotate3;

                action = node.runAction(
                    cc.sequence(
                        //加速
                        //cc.rotateBy(time1, rotate1).easing(cc.easeSineIn()), 
                        //平均
                        cc.rotateBy(time2, rotate2),
                        //减速
                        cc.rotateBy(time3, rotate3).easing(cc.easeQuarticActionOut()),
                        //cc.rotateBy(config.time, rotate),
                        cc.callFunc(config.end_func || defaultFunc, target)
                    ));
                //action.easing(cc.easeQuinticActionOut());
            } break;
        case ActionEnum.move_and_fadeout:
            {
                if (get_config) {
                    return {
                        begin_pos: cc.v2(0, 0),
                        end_pos: cc.v2(0, 0),

                        move_time: 1,
                        fade_time_delay: 0.8,
                        fade_time: 0.2,

                        is_hide: false,

                        end_func: null,
                    };
                }

                let fade_delay = config.fade_time_delay;
                node.setPosition(config.begin_pos);
                action = node.runAction(cc.spawn(
                    cc.moveBy(config.move_time, config.end_pos),
                    cc.sequence(
                        cc.delayTime(fade_delay), cc.fadeOut(config.fade_time),
                        cc.callFunc(function () {
                            if (config.is_hide) {
                                node.active = false;
                            }
                        }),
                        cc.callFunc(config.end_func || defaultFunc, target)
                    )));
            } break;
        case ActionEnum.fast_shake:
            {
                if (get_config) {
                    return {
                        rotate_rand: 15,
                        time: 1,

                        end_func: null,
                    };
                }

                let begin_rotation = node.rotation;

                let repeat_action = cc.repeat(
                    cc.sequence(
                        cc.delayTime(0.017),
                        cc.callFunc(function () {
                            node.rotation = cc.randomMinus1To1() * config.rotate_rand;
                        }
                        )), Math.floor(config.time / 0.017));
                node.runAction(repeat_action);

                action = node.runAction(
                    cc.sequence(
                        cc.delayTime(config.time),
                        cc.callFunc(function () {
                            node.rotation = begin_rotation;
                        }),
                        cc.callFunc(config.end_func || defaultFunc, target)
                    ));
            } break;
        case ActionEnum.jump_to:
            {
                if (get_config) {
                    return {
                        end_pos: cc.v2(0, 0),
                        time: 0.3,
                        jump_height: 40,
                        jumps: 1,

                        end_func: null,
                    };
                }

                action = node.runAction(
                    cc.sequence(
                        cc.jumpTo(config.time, config.end_pos.x, config.end_pos.y, config.jump_height, config.jumps),
                        cc.callFunc(config.end_func || defaultFunc, target)
                    ));
            } break;
        case ActionEnum.scale_to:
            {
                if (get_config) {
                    return {
                        end_scale: cc.v2(0, 0),
                        time: 0.3,

                        end_func: null,
                    };
                }

                action = node.runAction(
                    cc.sequence(
                        cc.scaleTo(config.time, config.end_scale.x, config.end_scale.y),
                        cc.callFunc(config.end_func || defaultFunc, target)
                    ));
            } break;
        case ActionEnum.repeat_jump:
            {
                if (get_config) {
                    return {
                        jump_height: 50,
                        jump_top_time: 0.2,
                        top_delay_time: 0.2,
                        jump_bottom_time: 0.15,
                        bottom_delay_time: 0.2,

                        repeat_count: -1,
                        end_func: null,
                    };
                }

                let repeat_action = cc.sequence(
                    cc.moveBy(config.jump_top_time, 0, config.jump_height).easing(cc.easeSineIn()),
                    cc.delayTime(config.top_delay_time),
                    cc.moveBy(config.jump_bottom_time, 0, -config.jump_height),
                    cc.delayTime(config.bottom_delay_time)
                );
                if (config.repeat_count > 0) {
                    action = node.runAction(
                        cc.sequence(cc.repeat(
                            repeat_action,
                            config.repeat_count
                        ), cc.callFunc(config.end_func || defaultFunc, target)
                        ));
                }
                else {
                    action = node.runAction(
                        cc.repeatForever(
                            repeat_action
                        ));
                }
            } break;
        case ActionEnum.move_to:
            {
                if (get_config) {
                    return {
                        move_to_pos: cc.v2(0, 0),
                        move_time: 2,

                        repeat_count: -1,
                        end_func: null,
                    };
                }

                let begin_pos = node.getPosition();
                let repeat_action = cc.sequence(
                    cc.callFunc(function () { node.setPosition(begin_pos); }),
                    cc.moveTo(config.move_time, config.move_to_pos)
                );
                if (config.repeat_count > 0) {
                    action = node.runAction(
                        cc.sequence(cc.repeat(
                            repeat_action,
                            config.repeat_count
                        ), cc.callFunc(config.end_func || defaultFunc, target)
                        ));
                }
                else {
                    action = node.runAction(
                        cc.repeatForever(
                            repeat_action
                        ));
                }
            } break;
        case ActionEnum.delay_distroy:
            {
                if (get_config) {
                    return {
                        delay_time: 2,
                        end_func: null,
                    };
                }

                action = node.runAction(
                    cc.sequence(
                        cc.delayTime(config.delay_time),
                        cc.callFunc(function () {

                            node.destroy();

                        }))

                );
            } break;
        case ActionEnum.setting_localZOrder:
            {
                if (get_config) {
                    return {
                        localZOrder: -1,
                        is_onload: true,
                    };
                }
                node.setLocalZOrder(config.localZOrder);
            } break;
        case ActionEnum.scene_fade_show:
            {
                if (get_config) {
                    return {
                        fade_time: 0.3,
                        end_func: null,
                    };
                }

                node.opacity = 0;
                action = node.runAction(
                    cc.sequence(
                        cc.fadeIn(config.fade_time),
                        cc.callFunc(config.end_func || defaultFunc, target)
                    ));
            } break;
        case ActionEnum.scene_fade_hide:
            {
                if (get_config) {
                    return {
                        fade_time: 0.5,
                        end_func: null,
                    };
                }

                action = node.runAction(
                    cc.sequence(
                        cc.fadeOut(config.fade_time),
                        cc.callFunc(config.end_func || defaultFunc, target)
                    ));
            } break;
        case ActionEnum.star_display:
            {
                if (get_config) {
                    return {
                        time_1: 0.2,
                        time_2: 0.1,
                        time_3: 0.1,
                        begin_scale: 2,
                        scale_to_1: 0.78,
                        scale_to_2: 1.2,
                        scale_to_3: 1,
                        fade_to_1: 255,
                        fade_to_2: 178,
                        fade_to_3: 255,

                        end_func: null,
                    };
                }

                node.setScale(config.begin_scale);
                node.setOpacity(0);
                action = node.runAction(cc.spawn(
                    cc.sequence(cc.scaleTo(config.time_1, config.scale_to_1), cc.scaleTo(config.time_2, config.scale_to_2), cc.scaleTo(config.time_3, config.scale_to_3)),
                    cc.sequence(
                        cc.fadeTo(config.time_1, config.fade_to_1), cc.fadeTo(config.time_2, config.fade_to_2), cc.fadeTo(config.time_3, config.fade_to_3),
                        cc.callFunc(config.end_func || defaultFunc, target)
                    )));
            } break;
        case ActionEnum.physics_sync_time:
            {
                if (get_config) {
                    return {
                        time: 5,
                    }
                }

                let body = node.getComponent(cc.RigidBody);
                if (body) {
                    body.schedule(function () {
                        body.syncPosition();
                        body.syncRotation();
                    }, 0.05, config.time / 0.05);
                }

            } break;
        case ActionEnum.delay_pos_to:
            {
                if (get_config) {
                    return {
                        time: 1,
                        pos_to: cc.v2(0, 0),

                        end_func: null,
                    }
                }

                action = node.runAction(cc.sequence(cc.delayTime(config.time), cc.callFunc(function () {
                    node.setPosition(config.pos_to);
                    config.end_func();
                })));
            } break;
        case ActionEnum.delay_addeffect:
            {
                if (get_config) {
                    return ActionClassDefine.delay_addeffect;
                }

                if (config.effect_pre != null) {
                    cc.director.getPhysicsManager().enabled = true;
                    node = config.target ? config.target : node;
                    let child = node.getChildByName(config.effect_pre.name);
                    if (child != undefined) {
                        child.destroy();
                    }

                    if (config.time > 0) {
                        action = node.runAction(cc.sequence(cc.delayTime(config.time), cc.callFunc(function () {
                            node.addChild(cc.instantiate(config.effect_pre));
                        }, node)));
                    }
                    else {
                        node.addChild(cc.instantiate(config.effect_pre));
                    }
                }


            } break;

        //UI
        case ActionEnum.UIShow_scaleChange://通过scale变化弹出(对话框用)
            {
                if (get_config) {
                    return {
                        time_1: 1.0 / 30 * 8,
                        time_2: 1.0 / 30 * 10,
                        begin_scale: 0.01,
                        scale_1: 1.15,
                        end_scale: 1,
                        ease_speed_1: 2,
                        ease_speed_2: 0.8,
                        end_func: null,
                    };
                }

                node.setScale(config.begin_scale);
                action = node.runAction(
                    cc.sequence(
                        cc.scaleTo(config.time_1, config.scale_1).easing(cc.easeIn(config.ease_speed_1)),
                        cc.scaleTo(config.time_2, config.end_scale).easing(cc.easeElasticOut(config.ease_speed_2)),
                        cc.callFunc(config.end_func || defaultFunc, target)
                    )
                );
            } break;
        case ActionEnum.UIClose_scaleChange://通过scale变化关闭(对话框用)
            {
                if (get_config) {
                    return {
                        time_1: 0.2,
                        time_2: 1.0 / 30.0 * 5.9,
                        scale_1: 1.05,
                        end_scale: 0.01,
                        ease_speed_1: 3,
                        end_func: null,
                    };
                }

                action = node.runAction(
                    cc.sequence(
                        cc.scaleTo(config.time_1, config.scale_1).easing(cc.easeBackOut()),
                        cc.scaleTo(config.time_2, config.end_scale).easing(cc.easeElasticIn(config.ease_speed_1)),
                        cc.callFunc(config.end_func || defaultFunc, target)
                    ));
            } break;
        case ActionEnum.UIShow_SweetAlert://从中间扩散
            {
                if (get_config) {
                    return {
                        begin_scale: 0.5,
                        scale_1: 1.05,
                        scale_2: 0.95,
                        end_scale: 1,

                        time_1: 0.3 * 0.45,
                        time_2: 0.3 * 0.35,
                        time_3: 0.3 * 0.2,

                        end_func: null,
                    };
                }

                node.setScale(config.begin_scale);
                action = node.runAction(
                    cc.sequence(
                        cc.scaleTo(config.time_1, config.scale_1),
                        cc.scaleTo(config.time_2, config.scale_2),
                        cc.scaleTo(config.time_3, config.end_scale),
                        cc.callFunc(config.end_func || defaultFunc, target)
                    )
                );
            } break;
        case ActionEnum.UIClose_SweetAlert://从中间扩散
            {
                if (get_config) {
                    return {
                        begin_scale: 1,
                        scale_1: 1.05,
                        scale_2: 0.95,
                        end_scale: 0.001,
                        end_opacity: 0,

                        time_1: 0.2 * 0.45,
                        time_2: 0.2 * 0.35,
                        time_3: 0.2 * 0.2,

                        end_func: null,
                    };
                }

                let all_time = config.time_1 + config.time_2 + config.time_3;
                action = node.runAction(
                    cc.spawn(
                        cc.sequence(
                            cc.scaleTo(config.time_1, config.scale_1),
                            cc.scaleTo(config.time_2, config.scale_2),
                            cc.scaleTo(config.time_3, config.end_scale),
                            cc.callFunc(config.end_func || defaultFunc, target)
                        ), cc.fadeTo(all_time, config.end_opacity))
                );
            } break;
        case ActionEnum.UIShow_LayerFadeChange://从中间扩散渐入
            {
                if (get_config) {
                    return {
                        begin_scale: 0.5,
                        end_scale: 1,

                        begin_opacity: 0,
                        end_opacity: 255,
                        time_1: 0.3,

                        end_func: null,
                    };
                }

                node.setScale(config.begin_scale);
                node.setOpacity(config.begin_opacity);
                action = node.runAction(
                    cc.spawn(
                        cc.sequence(
                            cc.scaleTo(config.time_1, config.end_scale),
                            cc.callFunc(config.end_func || defaultFunc, target)
                        ), cc.fadeTo(config.time_1, config.end_opacity))
                );
            } break;
        case ActionEnum.UIClose_LayerFadeChange://
            {
                if (get_config) {
                    return {
                        end_scale: 0.5,

                        end_opacity: 0,
                        time_1: 0.2,

                        end_func: null,
                    };
                }

                action = node.runAction(
                    cc.spawn(
                        cc.sequence(
                            cc.scaleTo(config.time_1, config.end_scale),
                            cc.callFunc(config.end_func || defaultFunc, target)
                        ), cc.fadeTo(config.time_1, config.end_opacity))
                );
            } break;
        case ActionEnum.UIShow_Spread://从中间扩散渐入
            {
                if (get_config) {
                    return {
                        begin_scale: cc.v2(0, 1),
                        end_scale: cc.v2(1, 1),

                        begin_opacity: 0,
                        end_opacity: 255,
                        time_1: 0.2,

                        end_func: null,
                    };
                }

                node.setScale(config.begin_scale.x, config.begin_scale.y);
                node.setOpacity(config.begin_opacity);
                action = node.runAction(
                    cc.spawn(
                        cc.sequence(
                            cc.scaleTo(config.time_1, config.end_scale.x, config.end_scale.y),
                            cc.callFunc(config.end_func || defaultFunc, target)
                        ), cc.fadeTo(config.time_1, config.end_opacity))
                );
            } break;
        case ActionEnum.UIClose_Spread://
            {
                if (get_config) {
                    return {
                        scale_1: cc.v2(0.5, 1),
                        end_scale: cc.v2(0, 1),

                        end_opacity: 0,
                        time_1: 0.5 * 0.5,
                        time_2: 0.5 * 0.5,

                        end_func: null,
                    };
                }

                action = node.runAction(
                    cc.sequence(
                        cc.scaleTo(config.time_1, config.scale_1.x, config.scale_1.y),
                        cc.spawn(
                            cc.scaleTo(config.time_2, config.end_scale.x, config.end_scale.y),
                            cc.fadeTo(config.time_2, config.end_opacity),
                        ),
                        cc.callFunc(config.end_func || defaultFunc, target)
                    )
                );
            } break;
        case ActionEnum.UIShow_Fade:
            {
                if (get_config) {
                    return {
                        begin_opacity: 0,
                        end_opacity: 255,
                        time_1: 0.3,

                        end_func: null,
                    };
                }


                node.setOpacity(config.begin_opacity);
                action = node.runAction(
                    cc.sequence(
                        cc.fadeTo(config.time_1, config.end_opacity),
                        cc.callFunc(config.end_func || defaultFunc, target)
                    )
                );
            } break;
        case ActionEnum.UIClose_Fade:
            {
                if (get_config) {
                    return {
                        begin_opacity: 255,
                        end_opacity: 0,
                        time_1: 0.2,

                        end_func: null,
                    };
                }


                node.setOpacity(config.begin_opacity);
                action = node.runAction(
                    cc.sequence(
                        cc.fadeTo(config.time_1, config.end_opacity),
                        cc.callFunc(config.end_func || defaultFunc, target)
                    )
                );
            } break;
    }

    if (action != null) {
        action.setTag(action_enum);
    }
    if (get_config) {
        return {};
    }
};

ActionClassDefine.delay_addeffect = cc.Class({
    extends: ActionClassDefine.ActionClassBase,
    name: "delay_addeffect",
    properties: {
        time: 0,
        clean_same_name: true,
        target: cc.Node,
        effect_pre: cc.Prefab,

        end_func: null,
    }
});

module.exports.ActionEnum = ActionEnum;
module.exports.doCommonAction = doCommonAction;
module.exports.getActionConfig = getActionConfig;
module.exports.ActionClassDefine = ActionClassDefine;
module.exports.stopActionByEnum = stopActionByEnum;
module.exports.hasActionByEnum = hasActionByEnum;