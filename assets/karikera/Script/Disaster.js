
// karikera: a~b 까지의 랜덤이에요!
function random(a, b)
{
    return (b-a) * Math.random() + a;
}


// karikera: 생성자에요
function Disaster()
{
}

// karikera: 재난동작 부분이에요
// 밑에서 각자 onDisaster를 따로 구현해요
// 구현하지 않았으면 이 함수가 불릴거에요
// target은 재난 대상이에요
Disaster.prototype.onDisaster = function(target)
{
    console.error("구현되지 않은 재난이에요!!");
};

// karikera: 재난을 구현하는 부분이에요
Disaster.화재 = new Disaster();
Disaster.화재.onDisaster = function(target)
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

module.exports = Disaster;