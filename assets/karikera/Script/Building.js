
var util = require('./util'); // util.js
var Disaster = require('./Disaster'); // Disaster.js의 클래스

var Building = cc.Class({
    extends: cc.Component,
    editor: {
        requireComponent: cc.Sprite
    },
    properties: {
        디버그_라벨:{
            default: null,
            type:cc.Label
        },
        전체_내구도:100,
        내구도: 100,
        수용_인구수: 100,
        인구수: 100,
    },
    statics: {
        hover:null
    },
    
    onLoad: function()
    {
        for(var p in this)
        {
            console.log(p)
        }
        // karikera: node의 마우스 이벤트를 밑의 onMouse*로 연결해요
        util.linkMouseEvent(this.node, this);  
        this._collider = this.node.getComponent(cc.PolygonCollider);
        this._sprite = this.node.getComponent(cc.Sprite);
        this.updateDebugLabel();
    },
    
    // author: karikera
    // tmx오브젝트로 부터 건물을 설정하고, tmx오브젝트를 지워요
    // tmxobj: tmx 파일에서의 오브젝트에요
    setTmxObject: function(tmxobj)
    {
        var tmxnode = tmxobj.getNode();
        var node = this.node;
        
        // karikera: gid는 Tiled에서 볼 수 있는 타일의 ID에요
        var gid = tmxobj.getGid();
        
        // karikera: tmxnode 위치 정보들을 node에 넣어요
        var pos = tmxnode.getPosition();
        var tmxnodep = tmxnode.parent;
        pos.x -= tmxnodep.anchorX * tmxnodep.width;
        pos.y -= tmxnodep.anchorY * tmxnodep.height;
        node.setPosition(pos);
        node.setAnchorPoint(tmxnode.getAnchorPoint());
        node.zIndex = tmxnodep.height-node.y;
        
        // karikera: tmxnode의 스프라이트를 node에 넣어요
        this._sprite = node.addComponent(cc.Sprite);
        this._sprite.spriteFrame = tmxnode.getSpriteFrame();
        
        // karikera: tmxnode를 지워요
        tmxnode.removeFromParent();
    },
    
    onMouseDown: function(e){
        if (Building.hover)
        {
            Disaster.화재.onDisaster(Building.hover);
        }
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
    
    // karikera: 디버그 라벨을 갱신시켜요
    updateDebugLabel:function()
    {
        var text = "";
        for(var p of ["인구수", "내구도"])
        {
            text += p +": " + this[p]+"\n";
        }
        text += "hover: " + (Building.hover == this);
        this.디버그_라벨.string = text;
    },

    // karikera: 호버 상태로 바꿔요
    _sethover:  function(){
        if (Building.hover === this) return;
        Building.hover = this;
        this.updateDebugLabel();
    },
    
    // karikera: 호버 상태를 아니게 바꿔요
    _unhover:  function(){
        if (Building.hover !== this) return;
        Building.hover = null;
        this.updateDebugLabel();
    },
    
});

