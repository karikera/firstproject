
var Building = require("./Building/Building");

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

cc.Class({
    extends: cc.Component,

    properties: {
        tilemap: {
            default: null,
            type: cc.TiledMapAsset
        }
    },

    // karikera: 초기화
    onLoad: function () {
        // 타일맵을 로드하고 위치를 조정하는 부분이에요
        var tiledmap = new cc.TiledMap();
        tiledmap = this.node.addComponent(cc.TiledMap);
        tiledmap.tmxAsset = this.tilemap;
        this._layerOver1 = tiledmap.getLayer("Over 1");
        this._layerUnder1 = tiledmap.getLayer("Under 1");
        this._layerUnder2 = tiledmap.getLayer("Under 2");
        moveLayer(this._layerUnder1, 0, 12);
        moveLayer(this._layerUnder2, 0, 24);
        
        
        
        // karikera: 키보드 이벤트를 밑의 onKeyPressed/onKeyReleased 함수로 받을 수 있게 연결해요
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.onKeyPressed.bind(this),
            onKeyReleased: this.onKeyReleased.bind(this)
        }, this);
    },
    // karikera: 키보드 눌렀을 때 동작
    onKeyPressed: function(keyCode, event) {
        console.log("test");
        switch(keyCode) {
            case cc.KEY.left:
                break;
        }
    },
    // karikera: 키보드 땟을 때 동작
    onKeyReleased: function(keyCode, event) {
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
