/**
 * @fileOverview 재난 클래스에요! 재난 버튼은 이 스크립트를 가지고 있어야해요
 * @author karikera
 */

var Ground = require('./Ground'); // Ground.js의 클래스
var Building = require('./Building'); // Building.js의 클래스
var Material = require('./Material');
var Stage = require('./Stage');
var util = require('./util');


var 자재_재난_상성표 = [
//	화재		지진  싱크홀		비   태풍  	강풍  폭풍  
	[1.3,	1.4,	1,		1.1,	1.4,	1.2,	1.5], // 흙
	[1.5,	1.3,	1,		1.35,	1.55,	1.2,	1.4], // 나무
	[1,		1,		1,		1,		1,		1,		1], // 콘크리트
	[0,		0,		0,		0.05,	0,		0,		0], // 테스티움
];

var 지반_재난_상성표 = [
	// 화재	지진	싱크홀		비	태풍		강풍	폭풍
	[1,		1,		0,		1,		1,		1,		1], // 암석
	[1,		1.5,	1,		1.25,	1,		1,		1], // 흙
	[1,		2,		1,		1.5,	1,		1,		1], // 진흙
	[1,		2.5,	1,		1.7,	1.5,	1.2,	1.5], // 모래
	[0.5,	0,		0,		0,		2,		1,		1], // 물
];

/**
 * @author karikera
 * @desc 재난 대상 Enumerator에요!
 */
var DisaTarget = cc.Enum({
	타일: -1,
	건물: -1,
	전체: -1,
});

/**
 * @author karikera
 * @desc a <= x < b 의 랜덤이에요!
 * @param {number} a 숫자 범위 시작
 * @param {number} b 숫자 범위 끝
 * @return {number}
 */
function random(a, b)
{
    return (b-a) * Math.random() + a;
}

/**
 * @author karikera
 * @desc 재난 클래스에요!
 */
var Disaster = cc.Class({
	extends: cc.Component,
    editor: {
        requireComponent: cc.Button
    },
	properties: {
		id: 0,
		이름: "",
		준비_시간: 0,
		대상: {
			default: DisaTarget.타일,
			type: DisaTarget
		},
		타일_범위_X: 1,
		타일_범위_Y: 1,
		내구도_피해: "전체*0.1 + 현재*0.1 + 10",
		인명_피해: "전체*0.1 + 현재*0.1 + 10",
	},
	statics: {
		selected: null, // 현재 선택되어있는 재난이에요
		Target: DisaTarget
	},
	onLoad: function()
	{ 
		// onClick 함수를 클릭 이벤트에 넣어요!
		this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onClick.bind(this));

		// 내구도_피해와 인명_피해를 함수로 바꿔요
		this.내구도_피해 = new Function("현재", "전체", "return " + this.내구도_피해);
		this.인명_피해 = new Function("현재", "전체", "return " + this.인명_피해);

		// 각자의 특수 기능을 구현해요
		switch(this.이름)
		{
		case '지진':
			this.disasterToTile = function(tilePos, stage)
			{
				// 지진 발생시!
				var buildings = Building.getAll();
				var that = this;
				for(var i=0;i<buildings.length;i++)
				{
					var building = buildings[i];
					// 거리 대미지 계산
					building.region((x, y) => {
						var damageper = 0;
						var dx = Math.abs(tilePos.x - x);
						var dy = Math.abs(tilePos.y - y);
						var distance = dx + dy;
						if (distance === 0) damageper = 1;
						else if(distance <= 3) damageper = 0.8;
						else if(distance <= 6) damageper = 0.4;
						else if(distance <= 10) damageper = 0.15;
						else if(distance <= 30) damageper = 0.05;
						else damageper = random(0, 0.01);
						
						// 대미지 적용!
						that.damageTo(building, damageper);
					});
				}
			};
			break;
		}
	},
	/**
	 * @author karikera
	 * @desc 해당 지반과 자재의 상성을 계산해요!
	 * @param {Ground} ground
	 * @param {number} material
	 */
	getDamageRate: function(ground, material)
	{
		var arr = 지반_재난_상성표[ground.id - 1];
		var v = 1;
		if (arr)
		{
			v = arr[this.id]; 
			if (v === undefined)
			{
				console.warn("알 수 없는 재난: " + this);
				v = 1;
			}
		}
		else
		{
			console.warn("알 수 없는 지반: " + ground);
		}
		arr = 자재_재난_상성표[material];
		if (!arr)
		{
			console.warn("알 수 없는 자재: " + material);
			return v;
		}
		var v2 = arr[this.id];
		if (v2 === undefined)
		{
			console.warn("알 수 없는 재난: " + this);
			return v;
		}
		return v * v2;
	},
	/**
	 * @author karikera
	 * @desc 재난동작 기본 동작이에요!
	 * @param {cc.Vec2} tilepos 재난 위치
	 * @param {Stage} stage 스테이지
	 */
	disasterToTile: function (tilepos, stage)
	{
		var width = this.타일_범위_X;
		var height = this.타일_범위_Y;
		var x = 0, y = 0;

		if (width === 0)
		{
			x = 0;
			width = stage.width;
		}
		else
		{
			x = Math.floor(tilepos.x - width / 2);
		}

		if (height === 0)
		{
			y = 0;
			height = stage.height;
		}
		else
		{
			y = Math.floor(tilepos.y - height / 2);
		}

		util.makeRegion(cc.p(x, y), width, height)(
			(x, y) => Building.get(cc.p(x, y)).damageTo(bs[bid])
		);
	},
	/**
	 * @author karikera
	 * @desc 재난동작 기본 동작이에요!
	 * @param {Building} target 재난 대상
	 * @param {Stage} stage 스테이지
	 */
	disasterToBuilding: function(target, stage)
	{
		this.damageTo(target);
	},
	/**
	 * @author karikera
	 * @desc 재난동작 기본 동작이에요!
	 * @param {Stage} stage 스테이지
	 */
	disasterToStage: function(stage)
	{
		var list = Building.getAll();
		for(var i=0;i<list.length;i++)
		{
			this.damageTo(list[i]);
		}
	},
	/**
	 * @author karikera
	 * @desc target에게만 재난 피해를 입혀요!
	 * 				이 함수를 사용해서 전체에게 적용시키는 구조에요
	 * 				rate 는 비율이에요
	 * @param {Building} target
	 * @param {number} rate
	 */
	damageTo: function(target, rate)
	{
		if (rate === undefined) rate = 1;

		var ddamage = this.내구도_피해(target.내구도, target.전체_내구도);
		var hdamage = this.인명_피해(target.인구수, target.수용_인구수);

		rate *= this.getDamageRate(target.지반, target.자재);
		hdamage *= rate;
		ddamage *= rate;

		if (ddamage <= 0) ddamage = 0;
		else if (ddamage < 1) ddamage = 1;
		if (hdamage <= 0) hdamage = 0;
		else if (hdamage < 1) hdamage = 1;
		
		// 대미지를 입혀요!
		// 자바스크립트는 기본적으로 실수 연산을 하기 때문에 Math.round로 반올림을 했어요!
		target.damage(Math.round(ddamage), Math.round(hdamage));
	},
	/**
	 * @author karikera
	 * @desc 재난 버튼을 클릭했을 때에요!
	 */
	onClick: function ()
	{
		console.log("Select "+this);
		Disaster.selected = this;
	},
	toString: function()
	{
		return "[재난:"+this.이름+"#"+this.id+"]";
	},
});

module.exports = Disaster;
