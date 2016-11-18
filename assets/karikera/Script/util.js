/**
 * @fileOverview 기타 함수 모음이에요! (클래스는 아니에요)
 * @author karikera
 */

/** @type{cc.Label} */
var debugLabel = null;

/** @type {cc.Component} */
var debugLabelComponent = null;

/** @type {Array.<string>} */
var debugLabelFields = null;

var util = {

	/**
	 * @author karikera
	 * @desc 해당 범위를 루프하는 함수를 만들어요!
	 * @param {cc.Vec2} pos 위치
	 * @param {number} width 넓이
	 * @param {number} height 높이
	 * @return {function(function(number,number))}
	 */
	makeRegion: function(pos, width, height)
	{
		return function(func){
			var x1 = pos.x;
			var x2 = x1 + width;
			var y1 = pos.y;
			var y2 = y1 + height;
			for(var y=y1;y<y2;y++)
			{
				for(var x=x1;x<x2;x++)
				{
					func(x, y);
				}
			}
		};
	},
   
   /**
	* @author karikera
	* @desc node에 발생하는 키보드 혹은 마우스 이벤트를 target.on* 함수로 받을 수 있게 연결해요
	*				있는 함수만 연결되고, 없는 함수는 연결되지 않아요
	*				마우스 이벤트: onMouseDown, onMouseUp, onMouseMove, onMouseLeave
	*				키보드 이벤트: onKeyPressed, onKeyReleased
    */
    linkInputEvent: function(node, target)
    {
        if (target.onMouseDown) node.on(cc.Node.EventType.MOUSE_DOWN, target.onMouseDown.bind(target));
        if (target.onMouseUp) node.on(cc.Node.EventType.MOUSE_UP, target.onMouseUp.bind(target));
        if (target.onMouseMove) node.on(cc.Node.EventType.MOUSE_MOVE, target.onMouseMove.bind(target));
        if (target.onMouseEnter) node.on(cc.Node.EventType.MOUSE_ENTER, target.onMouseEnter.bind(target));
        if (target.onMouseLeave) node.on(cc.Node.EventType.MOUSE_LEAVE, target.onMouseLeave.bind(target));
		
		if (target.onKeyPressed || target.onKeyReleased)
		{
			var onKeyPressed = target.onKeyPressed ? target.onKeyPressed.bind(target) : function(){};
			var onKeyReleased = target.onKeyReleased ? target.onKeyReleased.bind(target) : function(){};
			cc.eventManager.addListener({
				event: cc.EventListener.KEYBOARD,
				onKeyPressed: onKeyPressed,
				onKeyReleased: onKeyReleased
			}, node);
		}  
    },

    // author: karikera
    // 좌표에 + 표시를 넣는 기능인데 안되네요 ( . . . ) . .
    /**
     * @param {cc.Node} parent 
     * @param {cc.Color} color
     * @param {number} x
     * @param {number} y
    */
    addMark: function(parent, color, x, y)
    {
        console.log(x, y);
        var node = new cc.Node;
        node.setPosition(x, y);
        /** @type{cc.Graphics} */
        var g = node.addComponent(cc.Graphics);
        g.update = function()
        {
            g.clear();
            g.strokeColor = color;
            g.moveTo(-10, 0);
            g.lineTo(10, 0);
            g.moveTo(0, -10);
            g.lineTo(0, 10);
            g.stroke();
        };
        parent.addChild(node);
        node.zIndex = 10000;
    },

    /**
     * @author karikera
     * @desc component 에 있는 속성들을 fields 배열에서 찾아서 글자로 띄워놔요!  
     * @param {cc.Component} component 정보를 띄울 대상
     * @param {Array.<string>} fields component에서 띄울 속성명들
     */
    showDebugLabel: function(component, fields)
    {
        debugLabelComponent = component;
        debugLabelFields = fields;
        if (debugLabel === null)
        {
            var node = new cc.Node;
            node.zIndex = 10000;
            /** @type {cc.Label} */
            debugLabel = node.addComponent(cc.Label);
            debugLabel.fontSize = 20;
        }
        var op = debugLabel.node.parent;
        var np = component.node.parent;
        if (op !== np)
        {
            if(op) op.removeChild(debugLabel.node);
            np.addChild(debugLabel.node);
        }
        this.updateDebugLabel();
    },

    /**
     * @author karikera
     * @desc 디버그 레이블을 갱신해요! 
     *              GameScene.update에서 항상 호출하고 있어서 따로 사용할 필요는 없어요 
     */
    updateDebugLabel: function()
    {
        if (debugLabel === null) return;
        if (debugLabelComponent.node === null || debugLabelComponent.node.parent === null)
        {
            util.hideDebugLabel();
            return;
        }
        var text = "";
        for(var i=0;i<debugLabelFields.length;i++)
        {
            var p = debugLabelFields[i];
            text += p +": " + debugLabelComponent[p]+"\n";
        }  
        debugLabel.node.x = debugLabelComponent.node.x;
        debugLabel.node.y = debugLabelComponent.node.y;
        debugLabel.string = text.substr(0, text.length-1); 
    },

    /**
     * @author karikera
     * @desc 띄운 디버그 레이블을 없에요!
     */
    hideDebugLabel: function()
    {
        if (debugLabel === null) return;
		if (debugLabel.node !== null)
        	debugLabel.node.destroy();
        debugLabel = null;
        debugLabelComponent = null;
        debugLabelFields = null;
    },

    /**
     * @author karikera
     * @desc 디버그 라벨을 띄울 때 사용했던 컴포넌트를 가져와요!
     */
    getDebugLabelComponent: function()
    {
        return debugLabelComponent;
    },
};

module.exports = util;