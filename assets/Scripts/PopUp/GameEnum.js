
//////////////////////////////////////////////////////////////////////////
/*		基础枚举		*/
//////////////////////////////////////////////////////////////////////////

module.exports.AudioState = cc.Enum({
    AudioState_Unkonw : 0,	//未知
    AudioState_Off : -1,		//关闭
    AudioState_On : -1		//开启
});

//////////////////////////////////////////////////////////////////////////
/*		游戏管理部分		*/
//////////////////////////////////////////////////////////////////////////

//游戏事件
module.exports.GameEvent = cc.Enum({
    Begin_New_Game: 0,//新游戏    
    End_new_Game: -1,//新游戏生成结束
    Time_Finish: -1,
});
//游戏状态
module.exports.GameState = cc.Enum({
    No_Game: 0,//不在游戏中
    Prepare: -1,//准备中 
    Opartion_Busy: -1,//操作中 
    Opartion_idle: -1,//操作空闲 
    In_Game: -1,//游戏中
    Game_Over: -1,//游戏结束
});

//游戏模式
module.exports.GameModes = cc.Enum({
    Tradition: 1,//传统模式 
    Chanllenge: 2,//闯关模式
});

//////////////////////////////////////////////////////////////////////////
/*				*/
//////////////////////////////////////////////////////////////////////////

//场景
module.exports.SceneType = cc.Enum({
    Scene_None: 0,			//空场景		
    Scene_Loading: -1,          //加载场景
    Scene_Game: -1,		//游戏场景
    Scene_ChanllengeGame: -1, //闯关游戏场景
    Scene_Skill: -1,		//技能场景
    Scene_Login: -1,		//登录场景
    Scene_Stop: -1,		//暂停界面
    Scene_GameOver: -1,     //游戏结束
    Scene_ChanllengeGameOver: -1,    //闯关游戏结束
    Scene_Start: -1,		//游戏开始场景
    Scene_Upgrade: -1,     //升级技能界面
    Scene_Shop: -1,     //商店
    Scene_ChanllengeSelect: -1,//关卡选择界面
    Scene_Editor: -1,	//编辑界面
});


//方向枚举
module.exports.DirectionEnum = cc.Enum({
    TOP: 0,
    BOTTOM: -1,
    LEFT: -1,
    RIGHT: -1,
    TOP_LEFT: -1,
    TOP_RIGHT: -1,
    BOTTOM_LEFT: -1,
    BOTTOM_RIGHT: -1,
});

/////////////////////////////////////////////////////////////////////
/* 效果 */
/////////////////////////////////////////////////////////////////////

module.exports.LabelNumberEffectEvent = cc.Enum({
    NULL:0,//
    continue_change:-1,//持续变化
    show_tootip:-1,//弹改变信息
});

// //////////////////////////////////////////////////////////////////////////
// /*Notification Enum 监听者枚举		 */
// //////////////////////////////////////////////////////////////////////////

module.exports.GameSceneEvent = cc.Enum({
    Update_Intergral: 0,//刷新积分，该积分是回合数，每回合都会增加1。
    Update_GameScene_TV: -1,    //更新游戏场景TV显示
    Updata_GameScene_TV_Reset: -1,
    doReplay:-1,
    resurgence:-1,
    resetNewGame:-1,
    update_link_str:-1,
    update_score:-1,
    update_gift:-1,
});

module.exports.ShopSceneEvent = cc.Enum({
    Update_Coins: 0,   //刷新金币，当内购成功时，要刷新金币
});

module.exports.GameManagerEvent = cc.Enum({
    Update_skillButtonTouchTimes: 0, //当进度条满是，通知gameManager技能按钮使用次数加一

});

module.exports.LabelEvent = cc.Enum({
    update_gold:0,//
    update_star:-1,//
});

module.exports.Reward = cc.Enum({
    thank_null:0,
    gold:1, 
});

//获得Enum对应名字
module.exports.getEnumName = function(EnumClass,EnumVal)
{
    if(EnumClass !== undefined && EnumVal !== undefined)
    {
        for(var name in EnumClass)
        {
            if(EnumClass[name] === EnumVal)
            {
                return name;
            }
        }
    }

    return "";
}