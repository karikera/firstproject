/**
 * @fileOverview 스테이지 클래스에요!
 * 				타일드맵 노드에는 이 스크립트가 사용되야해요 
 * 				좌표에서 지반을 구해오는 등의 기능을 해요
 * @author karikera
 */
var Ground = require('./Ground');
var Building = require('./Building');

const DX = 64; // karikera: 타일 가로 간격 
const DY = 32; // karikera: 타일 세로 간격
const DZ = 12; // karikera: 타일의 두께 세로 간격

var Stage = cc.Class({
    extends: cc.Component,
	editor: {
		requireComponent: cc.TiledMap
	},
	statics: {
		current: null,
	},

	onLoad: function()
	{
		/** @type{cc.TiledMap} */
		var tiledmap = this.node.getComponent(cc.TiledMap);

		this.node.x = Math.round(this.node.x);
		this.node.y = Math.round(this.node.y);

		/** @type{cc.TiledLayer} */
		var layer = tiledmap.allLayers()[0];
		this.layer = layer;
		
		var mapsize = tiledmap.getMapSize();
		this.width = mapsize.width;
		this.height = mapsize.height;

		var tilesize = tiledmap.getTileSize();
		this.tiledWidth = tilesize.width * this.width;
		this.tiledHeight = tilesize.height * this.height;

		var firstCoord = layer.getPositionAt(0,0);
		this.mapOffsetX = firstCoord.x - this.tiledWidth/2 + DX / 2;
		this.mapOffsetY = firstCoord.y - this.tiledHeight/2 + DY / 2 + DZ;
		
	},

	/**
	 * @author karikera
	 * @desc 장면 상대 좌표에서 타일 좌표를 계산해요!
	 * 		타일좌표는 실수가 되요
	 * @param {cc.Vec2} coord 
	 */
    fromTileCoord: function(coord)
    {
		var x = coord.x - coord.y;
		var y = - coord.x - coord.y;
		x = x / 2 * DX + this.mapOffsetX;
		y = y / 2 * DY + this.mapOffsetY;
        return cc.p(x, y);
    },

	/**
	 * @author karikera
	 * @desc 장면 상대 좌표에서 타일 좌표를 계산해요!
	 * 		타일좌표는 실수가 되요 
	 * @param {cc.Vec2} point
	 */
    toTileCoordFloat: function(point)
    {
        var x = (point.x - this.mapOffsetX) / DX;
        var y = (point.y - this.mapOffsetY) / DY;
        return cc.p(x - y, - y - x);
    },

	/**
	 * @author karikera
	 * @desc 장면 상대 좌표에서 타일 좌표를 계산해요!
	 * 		타일좌표는 정수가 되요 
	 * @param {cc.Vec2} point
	 */
    toTileCoord: function(point)
    {
		var np = this.toTileCoordFloat(point);
        np.x = Math.round(np.x);
        np.y = Math.round(np.y);
        return np;
    },
	
	/**
	 * @author karikera
	 * @desc point 타일 좌표에서 지반을 가져와요!
	 * @param {cc.Vec2} point
	 * @return {Ground}
	 */
	getGround: function(point)
	{
		return Ground.getById(this.layer.getTileGIDAt(point));
	},

	/**
	 * @author karikera
	 * @desc region에서 지반을 가져와요!
	 * 		region 범위가 같은 지반이 아니면 경고를 띄워요
	 * @param {function} region
	 * @return {Ground}
	 */
	getGroundFromRegion: function(region)
	{
		var gid = -1;
		region((x, y) => {
			var ngid = this.layer.getTileGIDAt(cc.p(x, y));
			if (gid === -1)
			{
				gid = ngid;
			}
			else if(gid !== ngid)
			{
				console.warn("("+x +","+ y+") 지점의 지반이 통일되어있지 않아요!");
			} 
		});
		return Ground.getById(gid);
	},

	/**
	 * @author karikera
	 * @desc point 좌표에서 지반을 가져와요!
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