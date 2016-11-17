

var Stage = require('./Script/Stage');
var Building = require('./Script/Building'); // Building.js의 클래스
var Disaster = require('./Script/Disaster'); // Disaster.js의 클래스
var Mouse = require('./Script/Mouse');
var util = require('./Script/util'); // util.js의 클래스


/**
 * @author karikera
 * @description GameScene 클래스 부분이에요
 */
var GameScene = cc.Class({
    extends: cc.Component,

    properties: {
		cover:{
			default: null,
			type: cc.Node
		},
		mouse:{
			default: null,
			type: Mouse
		},
		stageNode: {
			default: null,
			type: cc.Node
		},
		stages:{
			default: [],
			type: ['String']
		},
    },

    // karikera: 초기화
    /** @this{GameScene} */
    onLoad: function () {
        console.log("onload");
		
		this.stage = null;
		var that = this;
        
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;

		Stage.loadStage(this.stageNode, this.stages[0], function(stage){ that.stage = stage; });
        
        // karikera: 키보드/마우스 이벤트를 밑의 on* 함수로 받을 수 있게 연결해요
        util.linkInputEvent(this.cover, this);
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
    
	onMouseMove: function (e) {
		/** @type {cc.Node} */
		var cover = this.cover;
		var pos = cover.convertToNodeSpaceAR(e.getLocation());
		this.mouse.node.setPosition(pos);
	},
    
    onMouseDown: function(e) {
        console.log("onMouseDown");
        if (this.mouse.hover)
        {
            Disaster.selected.onDisaster(this.mouse.hover, this.stage);
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