
var Building = require("./Script/Building"); // Building.js의 클래스
var Disaster = require("./Script/Disaster"); // Disaster.js의 클래스
var util = require('./Script/util'); // util.js의 클래스


/**
 * @author karikera
 * @description GameScene 클래스 부분이에요
 */
var GameScene = cc.Class({
    extends: cc.Component,
    editor: {
        requireComponent: cc.TiledMap
    },

    properties: {
    },

    // karikera: 초기화
    /** @this{GameScene} */
    onLoad: function () {
        console.log("onload");
        
        util.init(this);
        
        // karikera: 마우스 이벤트를 밑의 onMouse* 함수로 받을 수 있게 연결해요
        util.linkMouseEvent(this.node, this);
        
        // karikera: 키보드 이벤트를 밑의 onKey* 함수로 받을 수 있게 연결해요
        util.linkKeyEvent(this.node, this);
    },
    start: function(){
        cc.view.setFrameSize(this.node.width, this.node.height);
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
    
    onMouseDown: function(e) {
        console.log("onMouseDown");
        if (Building.hover)
        {
            Disaster.selected.onDisaster(Building.hover, this);
        }
    },
    
    /**
     * @author karikera
     * @param {number} dt
     */
    update: function(dt)
    {
        // 디버그 레이블을 계속 갱신해요!
        util.updateDebugLabel();
    },
});

module.exports = GameScene;