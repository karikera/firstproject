

var Stage = require('./Script/Stage');
var Building = require('./Script/Building'); // Building.js의 클래스
var Disaster = require('./Script/Disaster'); // Disaster.js의 클래스
var Mouse = require('./Script/Mouse');
var util = require('./Script/util'); // util.js의 클래스

const CAMSPEED = 500;


/**
 * @author karikera
 * @desc GameScene 클래스 부분이에요
 */
var GameScene = cc.Class({
    extends: cc.Component,

    properties: {
		mouse:{
			default: null,
			type: Mouse
		},
		canvas: {
			default: null,
			type: cc.Node
		},
		cover:{
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
		this.cover.width = this.canvas.width;
		this.cover.height = this.canvas.height;
		this.cover.x = this.canvas.x;
		this.cover.y = this.canvas.y;

		this.keyMap = new Array(256);
		this.keyMap[0] = false;
		for(var i=0;i<this.keyMap.length;i++)
			this.keyMap[i] = false;

		var that = this;

		// karikera: 건물이 무너지는 프리팹을 미리 로드해요! 안그러면 무너질 때 살짝 공백이 생겨요 ( . . . ) . ;   
		cc.loader.loadRes('Prefab/DestroyingBuilding');
        
		// karikera: 콜라이더 사용 설정과, 콜라이더에 선을 그려요!
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;

		Stage.loadStage(this.node, this.stages[0], function(stage){ 
			that.stage = stage;
			stage.setCamera(-that.cover.width / 2, -that.cover.height / 2);
		 });
        
        // karikera: 키보드/마우스 이벤트를 밑의 on* 함수로 받을 수 있게 연결해요
        util.linkInputEvent(this.cover, this);
    },
    // karikera: 키보드 눌렀을 때 동작
    onKeyPressed: function(keyCode, event) {
		if (keyCode >= this.keyMap.length) return;
		this.keyMap[keyCode] = true;
    },
    // karikera: 키보드 땟을 때 동작
    onKeyReleased: function(keyCode, event) {
		if (keyCode >= this.keyMap.length) return;
		this.keyMap[keyCode] = false;
    },
    
	onMouseMove: function (e) {
		// karikera: 마우스 노드를 마우스의 좌표로 이동시켜요! 
		this.mouse.node.setPosition(this.node.convertToNodeSpaceAR(e.getLocation()));
	},
    
    onMouseDown: function(e) {
        console.log("onMouseDown");
		if (Disaster.selected === null)
		{
			console.warn("No Disaster");
			return;
		}
		switch(Disaster.selected.대상)
		{
		case Disaster.Target.타일:
			var tilePos = null;
			if (this.mouse.hover && !this.mouse.hover.destroyed)
				tilePos = this.mouse.hover.tilePos;
			else
				tilePos = this.stage.toTileCoord(this.mouse.node.getPosition());
			Disaster.selected.disasterToTile(tilePos, this.stage);
			break;
		case Disaster.Target.건물:
			if (this.mouse.hover && !this.mouse.hover.destroyed)
			{
				Disaster.selected.disasterToBuilding(this.mouse.hover, this.stage);
			}
			break;
		case Disaster.Target.전체:
			Disaster.selected.disasterToStage(this.stage);
			break;
		}
    },
    
    /**
     * @author karikera
     * @param {number} dt
     */
    update: function(dt)
    {
		if (this.stage)
		{			
			var camX = 0, camY = 0;
			if (this.keyMap[cc.KEY.up] || this.keyMap[cc.KEY.w]) camY += CAMSPEED * dt;
			if (this.keyMap[cc.KEY.down] || this.keyMap[cc.KEY.s]) camY -= CAMSPEED * dt;
			if (this.keyMap[cc.KEY.right] || this.keyMap[cc.KEY.d]) camX += CAMSPEED * dt;
			if (this.keyMap[cc.KEY.left] || this.keyMap[cc.KEY.a]) camX -= CAMSPEED * dt;
			this.stage.moveCamera(camX, camY);
		}

        // 디버그 레이블을 계속 갱신해요!
        util.updateDebugLabel();
    },
});

module.exports = GameScene;