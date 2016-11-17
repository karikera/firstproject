
var util = require('./util'); // util.js
var Disaster = require('./Disaster'); // Disaster.js
var Ground = require('./Ground'); // Ground.js
var Material = require('./Material'); // Material.js

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
		}
    },
    statics: {
        hover:null, // karikera: 현재 마우스 위에 있는 건물이에요
    },
    
    onLoad: function()
    {
        // karikera: 키보드/마우스 이벤트를 밑의 on* 함수로 받을 수 있게 연결해요
        util.linkInputEvent(this.node, this);  
        
        // karikera: 기타 필요한걸 가져오며, 초기값을 설정해요!
        this._collider = this.node.getComponent(cc.PolygonCollider);
        this._sprite = this.node.getComponent(cc.Sprite);
        this.tilePos = null;
        this.tileX = -1;
        this.tileY = -1;
		this.지반 = null;
		this.node.zIndex = this.tileX + this.tileY;
        this.destroyed = false;
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
            this.destroyed = true;
            this.node.removeFromParent();
        }
    },

    /**
     * @author karikera
     * @description 콜라이더에 마우스가 들어왔는지 테스트해요
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
     * @description 디버그 라벨을 보여줘요!
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
