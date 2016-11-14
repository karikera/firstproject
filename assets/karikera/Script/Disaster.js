
// karikera: a~b 까지의 랜덤이에요!
function random(a, b)
{
    return (b-a) * Math.random() + a;
}

// karikera: 건물 타일 거리를 구해요!
function buildingDistance(a, b)
{
    var apos = a.node.getPosition();
    var bpos = b.node.getPosition();
    var DX = 64; 
    var DY = 32;
    var dx = (bpos.x - apos.x) / DX;
    var dy = (bpos.y - apos.y) / DY;
    
    var x = dx + dy;
    var y = dx - dy;
    return Math.round(Math.abs(x) + Math.abs(y));
}

// karikera: 생성자에요
function Disaster()
{
}

// karikera: 현재 선택되어있는 재난이에요
Disaster.selected = null;

// karikera: 재난동작 부분이에요
// 밑에서 각자 onDisaster를 따로 구현해요
// 구현하지 않았으면 이 함수가 불릴거에요
// target: 재난 대상
// gameScene: GameScene 인스턴스
Disaster.prototype.onDisaster = function(target, gameScene)
{
    console.error("구현되지 않은 재난이에요!!");
};

// karikera: 재난을 구현하는 부분이에요
Disaster.화재 = new Disaster();
Disaster.화재.onDisaster = function(target, gameScene)
{
    // 화재 발생시!
    
    // d대미지 = 전체 내구도 * 10~15%
    var ddamage = target.전체_내구도 * random(0.10, 0.15);
    // h대미지 = 인구수 * 25~35%
    var hdamage = target.인구수 * random(0.25, 0.35);
    
    // 내구도를 d대미지만큼 감소
    target.내구도 -= Math.round(ddamage);
    // 인구수를 h대미지만큼 감소
    target.인구수 -= Math.round(hdamage);
    // 자바스크립트는 기본적으로 실수 연산을 하기 때문에 Math.round로 반올림을 했어요!
    target.updateDebugLabel();
};

Disaster.지진 = new Disaster();
Disaster.지진.onDisaster = function(target, gameScene)
{
    // 지진 발생시!
    
    var buildings = gameScene.getBuildings();
    for(var i=0;i<buildings.length;i++)
    {
        var building = buildings[i];
        
        // 100% 대미지
        var ddamage = target.전체_내구도;
        var hdamage = target.인구수;
        
        // 암석 계산
        ddamage *= random(0.1, 0.15);
        hdamage *= random(0.05, 0.08);
        
        // 거리 대미지 계산
        var damageper = 0;
        var distance = buildingDistance(target, building);
        if (distance === 0) damageper = 1;
        else if(distance <= 3) damageper = 0.8;
        else if(distance <= 6) damageper = 0.4;
        else if(distance <= 10) damageper = 0.15;
        else if(distance <= 30) damageper = 0.05;
        else damageper = random(0, 0.01);
        
        ddamage *= damageper;
        hdamage *= damageper;
        
        // 내구도를 d대미지만큼 감소
        building.내구도 -= Math.round(ddamage);
        // 인구수를 h대미지만큼 감소
        building.인구수 -= Math.round(hdamage);
        // 자바스크립트는 기본적으로 실수 연산을 하기 때문에 Math.round로 반올림을 했어요!
        
        building.updateDebugLabel();
    }
};

module.exports = Disaster;
