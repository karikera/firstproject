
var Building = require("./Script/Building"); // Building.js의 클래스
var Disaster = require("./Script/Disaster"); // Disaster.js의 클래스
var util = require('./Script/util'); // util.js의 클래스


// author: karikera
// 레이어 위치를 이동시켜요
function moveLayer(layer, x, y)
{
    x *= 2;
    y *= 2;
    var layerSize = layer.getLayerSize();
    var tileSize = layer.getMapTileSize()
    layer.setContentSize(
        layerSize.width * tileSize.width + x, 
        layerSize.height * tileSize.height + y);
}

// karikera: GameScene 클래스 부분이에요
cc.Class({
    extends: cc.Component,
    editor: {
        requireComponent: cc.TiledMap
    },

    properties: {
    },

    // author: karikera 
    // 전체 건물을 목록을 가져와요!
    getBuildings:function()
    {
        var out = [];
        var count = this.node.childrenCount;
        for(var i=0; i < count ; i++ )
        {
            var child = this.node.children[i];
            var building = child.getComponent(Building);
            if (building === null) continue;
            out.push(building);
        }
        return out;
    },
    
    // karikera: 초기화
    onLoad: function () {
        console.log("onload");
        
        this.node.getBuildings = this.getBuildings.bind(this);
        
        // karikera: 타일맵을 로드하고 위치를 조정하는 부분이에요
        var tiledmap = this.node.getComponent(cc.TiledMap);
        this._layerUnder1 = tiledmap.getLayer("Under 1");
        this._layerUnder2 = tiledmap.getLayer("Under 2");
        moveLayer(this._layerUnder1, 0, 0);
        moveLayer(this._layerUnder2, 0, 12);
        
        /*
        // karikera: Tiled의 오브젝트를 코코스 크리에이터 노드로 변환하는 부분이지만, 불필요해졌어요
        var objs = tiledmap.getObjectGroup("Over 1").getObjects();
        for(var i=0;i<objs.length;i++)
        {
            var node = new cc.Node();
            var building = node.addComponent(Building);
            this.node.addChild(node);
            building.setTmxObject(objs[i]);
        }
        */
        
        // karikera: 마우스 이벤트를 밑의 onMouse* 함수로 받을 수 있게 연결해요
        util.linkMouseEvent(this.node, this);
        
        // karikera: 키보드 이벤트를 밑의 onKey* 함수로 받을 수 있게 연결해요
        util.linkKeyEvent(this.node, this);
    },
    // karikera: 키보드 눌렀을 때 동작
    onKeyPressed: function(keyCode, event) {
        console.log("onKeyPressed");
        switch(keyCode) {
            case cc.KEY.left:
                break;
        }
    },
    // karikera: 키보드 땟을 때 동작
    onKeyReleased: function(keyCode, event) {
        console.log("onKeyReleased");
    },
    
    // author: karikera 
    // 재난 선택 부분이에요!
    // 버튼이 직접 호출해요
    // e: 이벤트 객체
    // data: 버튼에서 넘겨주는 데이터
    onSelectDisaster: function(e, data) {
        Disaster.selected = Disaster[data];
    },
});
