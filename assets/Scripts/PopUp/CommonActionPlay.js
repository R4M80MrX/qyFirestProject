//管理播放CommonAction //若有多个CommonAction 通过tag管理播放,减少代码量
let CommonActionDelayPlay = cc.Class({
    name:'CommonActionDelayPlay',
    properties:{
        tag :0,
        delay :1,
    }
})

module.exports = cc.Class({
    extends:cc.Component,
    properties:{
        show_action_tag :0,
        close_action_tag :1,    
        enable_delay_play:{
            default:[],            
            type: [CommonActionDelayPlay],
            tooltip:'延迟自动播放动作',
        }
    },
    onEnable()
    {
        this.enable_delay_play.forEach(delay_play=>
        {
            this.scheduleOnce(function(){
                this.showActionByTag(delay_play.tag);
            },delay_play.delay)
        });
        //没用了清空 避免复制后重复显示
        this.enable_delay_play = [];
    },
    _getCommonAction(action_tag)
    {
        let com_actions = this.getComponents('CommonAction');        
        let find_com_action = this._findComAction(com_actions, action_tag);

        if(!find_com_action)
        {
            com_actions = this.getComponents('CommonExtentAction');
            find_com_action = this._findComAction(com_actions, action_tag);
        }
        
        return find_com_action;
    },
    _findComAction(com_actions,action_tag)
    {
        let find_com_action = null;

        if(com_actions)
        {
            com_actions.forEach(action=>
            {
                if(action.action_tag == action_tag)
                {
                    find_com_action = action;
                    return;
                }
            })    
        }
        return find_com_action;
    },
    show(action_node = null, end_func = null)
    {        
         return this.showActionByTag(this.show_action_tag, action_node, end_func);        
    },
    getShowConfig()
    {
        return this.getConfigByTag(this.show_action_tag);      
    },
    close(action_node = null, end_func = null)
    {
        return this.showActionByTag(this.close_action_tag, action_node, end_func);       
    },
    getCloseConfig()
    {
        return this.getConfigByTag(this.close_action_tag);       
    },
    showActionByTag(tag, action_node = null, end_func = null)
    {
        let action  = this._getCommonAction(tag);
        if(action)
        {
            action.showAction(action_node, end_func);
            return true;
        }

        return false;
    },
    getConfigByTag(tag)
    {
        let action  = this._getCommonAction(tag);
        if(action)
        {
            return action.getConfig() || {};            
        }
        return {};
    }
})