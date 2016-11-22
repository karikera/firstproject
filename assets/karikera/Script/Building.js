/**
 * @fileOverview 건물 클래스에요! 건물 정보를 담고 있어요
 * 				건물은 이 스크립트를 가지고 있어야해요!  
 * @author karikera
 */

var util = require('./util'); // util.js
var Ground = require('./Ground'); // Ground.js
var Material = require('./Material'); // Material.js
var DestroyingBuilding = require('./DestroyingBuilding'); // DestroyingBuilding.js

var id = 1;
var buildingByPos = {};
var buildings = {};

var Building = cc.Class({
    extends: cc.Component,
    editor: {
        requireComponent: cc.Sprite
    },
    properties: {
        전체_내구도:100,
        내구도: 100,
        수용_인구수: 100,
        인구수: 100,
        지하실: false,
		자재: {
			default: Material.흙,
			type: Material,
		},
		크기_X: 1,
		크기_Y: 1,
    },
    statics: {
        hover:null, // karikera: 현재 마우스 위에 있는 건물이에요

		/**
		 * @author karikera
		 * @desc 타일 좌표에서 건물을 가져와요!
		 * @param {cc.Vec2} pos
		 */
		get: function(pos)
		{
			var b = buildingByPos[pos.x+","+pos.y];
			if (!b) return null;
			return b;
		},
			
		/**
		 * @author karikera
		 * @desc 건물을 목록을 배열로 가져와요! 
		 */
		getAll:function()
		{
			var out = [];
			for(var p in buildingByPos)
			{
				out.push(buildingByPos[p]);
			}
			return out;
		},
		
    },
    
    onLoad: function()
    {        // karikera: 키보드/마우스 이벤트를 밑의 on* 함수로 받을 수 있게 연결해요
        util.linkInputEvent(this.node, this);  
        
        // karikera: 기타 필요한걸 가져오며, 초기값을 설정해요!
        this._collider = this.node.getComponent(cc.PolygonCollider);
        this._sprite = this.node.getComponent(cc.Sprite);
        this.tilePos = null;
        this.tileX = -1;
        this.tileY = -1;
		this.지반 = null;
        this.destroyed = false;

		util.fixAnchor(this.node);

		this.id = id;
		id = id + 1 | 0;
		if (id < 0) id = 1;

		buildings[this.id] =this;
    },

	destroyWithEffect: function ()
	{
		/** @type {cc.Sprite} */
		var sprite = this.node.getComponent(cc.Sprite);
		DestroyingBuilding.create(this.node, sprite.spriteFrame);
		this.node.destroy();
	},

	onDestroy: function ()
	{
		this.destroyed = true;
		this.region((x,y)=>delete buildingByPos[x+","+y]);
		delete buildings[this.id];
	},

	/**
	 * @param {Stage} stage
	 */
	init: function(stage)
	{
		// karikera: 타일 위치를 구해요!
		this.tilePos = stage.toTileCoordFloat(this.node.getPosition());
		this.tilePos.x = Math.round(this.tilePos.x - 0.5); 
		this.tilePos.y = Math.round(this.tilePos.y - 0.5);

		// karikera: 타일 위치에서 노드 위치를 다시 계산해서 보정시켜요 
		var ntilePos = cc.p(this.tilePos.x, this.tilePos.y);
		ntilePos.x += 0.5; ntilePos.y += 0.5;
		var intTilePos = stage.fromTileCoord(ntilePos);
		intTilePos.x = Math.round(intTilePos.x);
		intTilePos.y = Math.round(intTilePos.y);
		this.node.setPosition(intTilePos);

		// karikera: 타일 위치를 위쪽으로 재조정해요! x ~ x + width, y ~ y + height 로 계산이 가능하게요!
		ntilePos.x -= this.크기_X / 2;
		ntilePos.y -= this.크기_Y / 2;
		this.node.zIndex = ntilePos.x + ntilePos.y;
		this.tileX = this.tilePos.x -= this.크기_X + 1;
		this.tileY = this.tilePos.y -= this.크기_Y + 1;

		// karikera: 타일 좌표에서 영역을 만들어요
		this.region = util.makeRegion(this.tilePos, this.크기_X, this.크기_Y);

		// karikera: 영역에서 지반을 가져와요
		this.지반 = stage.getGroundFromRegion(this.region);

		// karikera: 영역에서 건물을 찾을 수 있도록 넣어놔요
		this.region((x,y)=>buildingByPos[x+","+y] = this);
	},
    
    /**
     * @author karikera
	 * @param {number} ddamage
	 * @param {number} hdamage
     */
    damage: function (ddamage, hdamage){
        // 내구도를 d대미지만큼 감소
        this.내구도 -= Math.round(ddamage);
        // 인구수를 h대미지만큼 감소
        this.인구수 -= Math.round(hdamage);

        // 내구도가 0보다 적으면 건물을 없애요
        if (this.내구도 <= 0)
        {
			this.destroyWithEffect();
        }
    },

    /**
     * @author karikera
     * @desc 콜라이더에 마우스가 들어왔는지 테스트해요
     */
    _testCollider: function(e)
    {
        var dpos = this.node.convertToNodeSpaceAR(e.getLocation());
        var hover = cc.Intersection.pointInPolygon(dpos, this._collider.world.points);
        if (hover) this._sethover();
        else this._unhover();
    },

    /** 
     * @author karikera
     * @desc 디버그 라벨을 보여줘요!
     *              고정된 수치를 보여줘서, 변경되면 다시 호출해야해요. 
    */
    showDebugLabel: function()
    {
        util.showDebugLabel(this, ["tileX", "tileY", "인구수", "내구도", "지반"]);
    },

    toString: function()
	{
		return "[건물:"+this.name+"]";
	},
});

module.exports = Building;
