
var Building = require('./Building');

var Mouse = cc.Class({
    extends: cc.Component,
	
    properties: {
    },

    // use this for initialization
    onLoad: function () {
		this.hover = null;
		this.hovers = [];
    },

	/**
	 * @param {cc.Collider} other
	 * @param {cc.Collider} self
	 */
	onCollisionEnter: function (other, self){
		var bnode = other.node;
		var building = bnode.getComponent(Building);
		if (!building === null) return;

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
