

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
		stageNode: {
			default: null,
			type: cc.Node
		},
		cover: {
			default: null,
			type: cc.Node
		},
		stages:{
			default: [],
			type: ['String']
		},
    },

    // karikera: 초기화
    onLoad: function () {
        console.log("onload");
		
		this.stage = null;
		this.cover.width = this.node.width;
		this.cover.height = this.node.height;
		this.camX = 0;
		this.camY = 0;

		// karikera: update 에서 키보드 상태를 확인하기 위해 있어요
		this.keyMap = new Array(256);
		this.keyMap[0] = false;
		for(var i=0;i<this.keyMap.length;i++)
			this.keyMap[i] = false;

		// karikera: 이 노드는 장면이 남아있어도 남아있게 해요!
		cc.game.addPersistRootNode(this.node);
		this.node.zIndex = 10000; // karikera: 이 노드는 항상 최상위여야해요!

		cc.director.setProjection(0);

		// karikera: 건물이 무너지는 프리팹을 미리 로드해요! 안그러면 무너질 때 살짝 공백이 생겨요 ( . . . ) . ;   
		cc.loader.loadRes('Prefab/DestroyingBuilding');
        
		// karikera: 콜라이더 사용 설정을 해요!
        cc.director.getCollisionManager().enabled = true;

        // karikera: 키보드/마우스 이벤트를 밑의 on* 함수로 받을 수 있게 연결해요
        util.linkInputEvent(this.cover, this);

		this.loadStage(this.stages[0]);
    },

	/**
	 * @author karikera
	 * @desc 스테이지를 로드해요!
	 * @param {string} name 장면 이름
	 */
	loadStage: function(name)
	{
		console.log("Load Stage: "+ name);

		var children = this.stageNode.children;
		while(children.length) children[0].destroy();

		var that = this;
		cc.director.loadScene(name, function(){
			var scene = cc.director.getScene();
			var tilemap = scene.getChildByName("타일맵");
			if (tilemap === null)
			{
				console.error("'타일맵' 노드가 없어요! 무조건 하나는 있어야해요!");
				return;
			}
			tilemap.removeFromParent();
			that.stageNode.addChild(tilemap);

			/** @type{Stage} */
			var stage = tilemap.getComponent(Stage);
			if (stage === null)
			{
				console.error("'타일맵'에는 Stage 스크립트가 있어야해요!");
				return;
			}

			that.stage = stage;

			var children = scene.children;
			for(var i=0;i<children.length;i++)
			{
				var child = children[i];
				if (child === that.node) continue;
				i--;
				child.removeFromParent();
				that.stageNode.addChild(child);
				var building = child.getComponent(Building);
				if (building !== null) building.init(stage);
			}
		});
	},

    // karikera: 키보드 눌렀을 때 동작
    onKeyPressed: function(keyCode, event) {
		if (keyCode >= this.keyMap.length) return;
		this.keyMap[keyCode] = true;
		switch(keyCode)
		{
		case cc.KEY.q:
			var mgr = cc.director.getCollisionManager();
        	mgr.enabledDebugDraw = !mgr.enabledDebugDraw;
			console.log('enabledDebugDraw: '+mgr.enabledDebugDraw);
			break;
		}
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
			this.camX += camX;
			this.camY += camY;
			this.stageNode.x = Math.round(-this.camX);
			this.stageNode.y = Math.round(-this.camY);
		}

        // 디버그 레이블을 계속 갱신해요!
        util.updateDebugLabel();
    },
});

module.exports = GameScene;