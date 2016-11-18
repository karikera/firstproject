/**
 * @fileOverview 건물이 없어질 때, 보이는 모습이에요! 건물이 없어지면, 이 스크립트를 가진 노드로 교체하게되요
 * @author karikera
 */

const SINK_PER_SEC = 100; // karikera: 초당 가라앉는 속도에요!

var DestroyingBuilding = cc.Class({
    extends: cc.Component,

	statics: {
		/**
		 * @author karikera
		 * @desc node의 위치에 파괴되는 건물 효과를 넣어요!
		 * @param {cc.Node} spriteNode
		 */
		create: function(spriteNode)
		{
			var parent = spriteNode.parent;
			var spriteFrame = spriteNode.getComponent(cc.Sprite).spriteFrame;
			
			var x = spriteNode.x;
			var y = spriteNode.y - spriteNode.height * spriteNode.anchorY;
			var zIndex = spriteNode.zIndex;

			/**
			 * @param {Error} err 
			 * @param {cc.Prefab} prefab
			 */
			function onLoad(err, prefab)
			{
				/** @type{cc.Node} */
				var dbnode = cc.instantiate(prefab);
				var db = dbnode.getComponent(DestroyingBuilding);
						
				dbnode.x = x;
				dbnode.y = y;
				dbnode.zIndex = zIndex;

				var rect = spriteFrame.getRect();
				var size = rect.height + Math.ceil(rect.width / 4);
				db.sprite.spriteFrame = spriteFrame;
				db.sprite.node.width = rect.width;
				db.sprite.node.height = rect.height;
				db.mask.node.width = size * 2;
				db.mask.node.height = size;
				db.lifeTime = rect.height / SINK_PER_SEC;
				db.overLifeTime = db.particle.life;

				parent.addChild(dbnode);
			}
			cc.loader.loadRes('Prefab/DestroyingBuilding', onLoad);
		},
	},

	properties: {
		mask: {
			default: null,
			type: cc.Mask
		},
		sprite: {
			default: null,
			type: cc.Sprite
		},
		particle: {
			default: null,
			type: cc.ParticleSystem
		}
	},

	onLoad: function (){
	},

    update: function (dt) {
		if (this.lifeTime <= 0)
		{
			this.overLifeTime -= dt;
			if (this.overLifeTime <= 0)
			{
				this.node.destroy();
			}
		}
		else
		{
			this.lifeTime -= dt;
			this.sprite.node.x = Math.random() * 4 - 2;
			this.sprite.node.y -= dt * SINK_PER_SEC;

			if (this.lifeTime <= 0)
			{
				/** @type{cc.ParticleSystem} */
				this.particle.stopSystem();
			}
		}
    },
});

module.exports = DestroyingBuilding;