
//////////////////////////////////////////////////////////////////////////
/*Notification  Name 监听者命名ID  */
//////////////////////////////////////////////////////////////////////////
module.exports.Notification = {
    GameScene:"1",
    ShopScene:"2",
	HotUpdate_Finished:"3",    
	
	
};

module.exports.UserLocal = {
	HaveArchive:"HaveArchive",
	ArchiveData:"ArchiveData",
};

//////////////////////////////////////////////////////////////////////////
/*清屏奖励 百分比															*/
//////////////////////////////////////////////////////////////////////////

module.exports.APPSTOREID        =  "1345268629";

module.exports.THREE_STARS_SOCRE_RATIO                 =                2.7;

module.exports.setStr = function (node, str) {
	if (node.$Label) node.$Label.string = str;
	else
	if (node.$RichText) node.$RichText.string = str;
	else
	if (node.$EditBox) node.$EditBox.string = str;
	else {
		let comp = node.getComponent(cc.Label) || node.getComponent(cc.RichText) || node.getComponent(cc.EditBox);
		if (comp) comp.string = str;
	}
}; 
module.exports.getStr = function (node) {
	if (node.$Label) return node.$Label.string;
	else
	if (node.$RichText) return node.$RichText.string;
	else
	if (node.$EditBox) return node.$EditBox.string;
	else {
		let comp = node.getComponent(cc.Label) || node.getComponent(cc.RichText) || node.getComponent(cc.EditBox);
		if (comp) return comp.string;
	}
	return '';
};
module.exports.getStrNum = function (node) {
	return parseInt(this.getStr(node));
};
module.exports.getBrotherStr = function (node, brother_name) {
	let parent = node.parent;
	let find = parent.getChildByName(brother_name);
	if (find) {
		return this.getStr(find);
	}
	return '';
};
module.exports.setBrotherStr = function (node, brother_name, str) {
	let parent = node.parent;
	let find = parent.getChildByName(brother_name);
	if (find) {
		this.setStr(find, str);
	}
};
module.exports.getBrotherStrNum = function (node, brother_name) {
	let parent = node.parent;
	let find = parent.getChildByName(brother_name);
	if (find) {
		return this.getStrNum(find);
	}
	return '';
};

	
//最小 包括最大
module.exports.getRandNumber = function (min,max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.dispatchUserDataEvent = function (Notifi_name,id_or_data,val = null)
{
    var data = null;
    if(val != null)
    {
        data = {id:id_or_data,val:val};
    }
    else
    {
        data = id_or_data;
    }
    var event = new cc.Event.EventCustom(Notifi_name, true);
    event.setUserData(data);
    cc.director.dispatchEvent(event);
};

module.exports.getPointRotate = function(beginPnt,rotate)
{    
    return cc.v2((beginPnt.x)*Math.cos(rotate) - (beginPnt.y)*Math.sin(rotate), (beginPnt.x)*Math.sin(rotate) + (beginPnt.y)*Math.cos(rotate));
};

//坐标系转换
//child不需要是parent子节点 
//获得 child 在parent上的位置
module.exports.convertNodeToNodeSpace = function (child,parent)
{
	if(child && parent)
	{
		return parent.convertToNodeSpaceAR(child.convertToWorldSpaceAR(cc.Vec2.ZERO));
	}
	return cc.Vec2.ZERO;
}

module.exports.getDegrees = function (vect)
{
    return module.exports.RadiansToDegrees(vect.signAngle(cc.Vec2.ZERO));    
};

//处理rotate 在0~360
module.exports.rotateIn0_360 = function(rotate)
{
	if(rotate < 0)
	{
		rotate += Math.ceil(- rotate / 360) * 360;
	}
	if(rotate >= 360)
	{
		rotate -= Math.floor(rotate / 360) * 360;
	}

	return rotate;
};

//弧度转角度
module.exports.RadiansToDegrees = function(rad)
{
    return rad * 57.29577951; // /PI * 180
};
//角度转弧度
module.exports.DegreesToRadians = function(rad)
{
    return rad * 0.01745329252; // PI / 180
};

//打乱数组
module.exports.randomArray = function(list)
{
	let count = list.length;
	var randCount = 0;
	var index = 0;
	var endIndex = 0;
	var temp = 0;
	do
	{
		var endPos = count - randCount;
		if (endPos <= 0)
		{
			break;
		}
		index = module.exports.getRandNumber(0, endPos-1);
		endIndex = endPos - 1;
		if (endIndex == index)
		{
			//自己与自己不替换
			randCount++;
			continue;
		}
		temp = list[endIndex];
		list[endIndex] = list[index];		 
		list[index] = temp;
		randCount++;
	} while (randCount < count);

}

//分辨率适配 对应的修改固定高 固定宽 
//GuF 目前竖屏可用,横屏未测,可能要修改
window.AdaptiveScreen = function()
{
	var size =  cc.v2(750,1334); ;
	let b_height = cc.view.getFrameSize().width / size.x > cc.view.getFrameSize().height / size.y;		
	if(cc.Canvas.instance.fitHeight != b_height || cc.Canvas.instance.fitWidth != !b_height)
	{
		cc.Canvas.instance.fitHeight = b_height;
		cc.Canvas.instance.fitWidth = !b_height;
	}
}