
var util = require('./util'); // util.js
var Disaster = require('./Disaster'); // Disaster.js의 클래스
var Ground = require('./Ground'); // Ground.js의 클래스

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
    },
    statics: {
        hover:null, // karikera: 현재 마우스 위에 있는 건물이에요
    },
    
    onLoad: function()
    {
        // karikera: node의 마우스 이벤트를 밑의 onMouse*로 연결해요
        util.linkMouseEvent(this.node, this);  
        
        // karikera: 기타 필요한걸 가져와요
        this._collider = this.node.getComponent(cc.PolygonCollider);
        this._sprite = this.node.getComponent(cc.Sprite);
        this.tilePos = util.toTileCoord(this.node.getPosition());
        this.tileX = this.tilePos.x;
        this.tileY = this.tilePos.y;

        // karikera: 지하 1층 지반
        this.지반1 = Ground.get(util.layer1, this.tilePos);

        // karikera: 지하 2층 지반
        this.지반2 = Ground.get(util.layer2, this.tilePos);
    },
    
    onMouseDown: function (e){
        throw new Error("hittest pass");
    },
    onMouseMove: function(e){
        this._testCollider(e);
    },
    onMouseLeave: function(e){
        this._unhover();
    },
    
    // karikera: 콜라이더에 마우스가 들어왔는지 테스트해요
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
        util.showDebugLabel(this, ["tileX", "tileY", "인구수", "내구도", "지반1", "지반2"]);
    },
    
    // karikera: 호버 상태로 바꿔요
    _sethover:  function(){
        if (Building.hover === this) return;
        Building.hover = this;
        this.showDebugLabel();
    },
    
    // karikera: 호버 상태를 아니게 바꿔요
    _unhover:  function(){
        if (Building.hover !== this) return;
        Building.hover = null;
    },
    
});

module.exports = Building;