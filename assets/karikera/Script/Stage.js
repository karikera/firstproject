
var Ground = require('./Ground');
var Building = require('./Building');

const DX = 64; // karikera: 타일 가로 간격 
const DY = 32; // karikera: 타일 세로 간격
const DZ = 12; // karikera: 타일의 두께 세로 간격

/** @type{cc.Node} */
var stageNode = null; 

var Stage = cc.Class({
    extends: cc.Component,
	editor: {
		requireComponent: cc.TiledMap
	},
	statics: {
		current: null,
		/**
		 * @author karikera
		 * @description 노드 안에 스테이지를 불러와요!
		 * @param {cc.Node} node
		 * @param {string} url
		 * @param {function(Stage)} onload
		 */
		loadStage: function(node, url, onload)
		{
			stageNode = node;
			node.removeAllChildren();
			
			/**
			 * @param {Error} err 
			 * @param {cc.Prefab} prefab
			 */
			function onLoad(err, prefab)
			{
				var container = cc.instantiate(prefab);
				node.addChild(container);
				
				var children = container.children;
				var stage = null;
				for(var i=0;i<children.length;i++)
				{
					var child = children[i];
					stage = child.getComponent(Stage);
					if (stage === null) continue;
					break;
				}
				for(var i=0;i<children.length;i++)
				{
					var child = children[i];
					var building = child.getComponent(Building);
					if (building === null) continue;

					building.tilePos = stage.toTileCoord(child.getPosition());
					building.tileX = building.tilePos.x;
					building.tileY = building.tilePos.y;
					child.zIndex = building.tileX + building.tileY;
					building.지반 = stage.getGround(building.tilePos);
				}
				onload(stage);
			}
			cc.loader.loadRes(url, cc.Prefab, onLoad);

			// canvas.runAction(cc.sequence( 
			// 	cc.fadeOut(), 
			// 	cc.callFunc(function () {
			// 		cc.director.loadScene('xxx');
			// 	})
			// ));
			// this.canvas.color = new cc.Color(0, 0, 0);
			// this.canvas.runAction(
			// 	cc.fadeIn(3.0)
			// ); 
		},
	},

	onLoad: function()
	{
		/** @type{cc.TiledMap} */
		var tiledmap = this.node.getComponent(cc.TiledMap);

		/** @type{cc.TiledLayer} */
		var layer = tiledmap.allLayers()[0];
		this.layer = layer;
		
		var tilesize = tiledmap.getTileSize();
		var mapsize = tiledmap.getMapSize();
		this.tiledWidth = tilesize.width * mapsize.width;
		this.tiledHeight = tilesize.height * mapsize.height;

		var firstCoord = layer.getPositionAt(0,0);
		this.mapOffsetX = firstCoord.x - this.tiledWidth/2 + DX / 2;
		this.mapOffsetY = firstCoord.y - this.tiledHeight/2 + DY / 2 + DZ;
		
	},

	/**
	 * @author karikera
	 * @description 건물을 목록을 배열로 가져와요! 
	 */
	getBuildings:function()
	{
		var out = [];
		var container = this.node.parent;
		var count = container.childrenCount;
		for(var i=0; i < count ; i++ )
		{
			var node = container.children[i];
			var building = node.getComponent(Building);
			if (building === null) continue;
			out.push(building);
		}
		return out;
	},
	
	/**
	 * @author karikera
	 * @description 장면 상대 좌표에서 타일 좌표를 계산해요!
	 */
    toTileCoord: function(point)
    {
        var x = (point.x - this.mapOffsetX) / DX;
        var y = (point.y - this.mapOffsetY) / DY;
        var tx = Math.round(x - y);
        var ty = Math.round(- y - x);
        return cc.p(tx, ty);
    },
	
	/**
	 * @author karikera
	 * @description point 타일 좌표에서 지반을 가져와요!
	 * @param {cc.Vec2} point
	 * @return {Ground}
	 */
	getGround: function(point)
	{
		return Ground.getById(this.layer.getTileGIDAt(point));
	},

	/**
	 * @author karikera
	 * @description point 좌표에서 지반을 가져와요!
	 * @param {cc.Vec2} point
	 * @return {Ground}
	 */
	pickGround: function(point)
	{
		point.x -= this.layer.xoff;
		point.y -= this.layer.yoff;
		return this.getGround(this.toTileCoord(point));
	},
});


module.exports = Stage;