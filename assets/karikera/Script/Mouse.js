/**
 * @fileOverview 마우스 클래스에요!
 * 				일반 클릭은 건물이 직사각형 모양으로만 되서,
 * 				정확히 구분하기 위해 마우스 노드와의 콜라이더를 이용한 충돌로 구현했어요!
 * @author karikera
 */

var Building = require('./Building');

var Mouse = cc.Class({
    extends: cc.Component,
	
    properties: {
    },

    // use this for initialization
    onLoad: function () {
		this.hover = null; // 마우스 위에 있는 것 중 가장 앞에있는 건물이에요!
		this.hovers = []; // 마우스 위에 있는 건물 목록이에요!
    },

	/**
	 * @param {cc.Collider} other
	 * @param {cc.Collider} self
	 */
	onCollisionEnter: function (other, self){
		var bnode = other.node;
		var building = bnode.getComponent(Building);
		if (building === null) return;

		for(var i=0;i<this.hovers.length;i++)
		{
			if (this.hovers[i].node.zIndex < bnode.zIndex) continue;
			this.hovers.splice(i, 0, building);
			return;
		}
		this.hovers.push(building);
		this.hover = building;
		this.hover.showDebugLabel();
	},

	onCollisionExit:  function (other, self){
		var building = other.node.getComponent(Building);
		if (building === null) return;

		if (this.hover === building)
		{
			this.hovers.pop();
			if (this.hovers.length === 0)
			{
				this.hover = null;
			} 
			else
			{
				this.hover = this.hovers[this.hovers.length - 1];
				this.hover.showDebugLabel();
			}
		}
		else
		{
			for(var i=0;i<this.hovers.length;i++)
			{
				if (this.hovers[i] === building)
				{
					this.hovers.splice(i, 1);
					break;
				} 
			}
		}
	},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

module.exports = Mouse;
