/**
 * @fileOverview 지반 클래스에요! 다른 클래스와 다르게 일반적인 자바스크립트 클래스 문법으로 만들어져있어요  
 * @author karikera
 */

var grounds = {};

/**
 * @author karikera
 * @desc 지반 클래스에요!
 * @param {number} id Tiled에서 아이디
 * @param {string} name 이름
 */
function Ground(id, name)
{
    grounds[id] = this;
	this.id = id; 
    this.name = name;
}

Ground.prototype.id = 0;
Ground.prototype.name = "";

Ground.prototype.toString = function()
{
    return "[지반:"+this.name+"#"+this.id+"]";
};

Ground.unknown = new Ground(0, "unknown");
Ground.암석 = new Ground(1, "암석");
Ground.흙 = new Ground(2, "흙");
Ground.진흙 = new Ground(3, "진흙");
Ground.모래 = new Ground(4, "모래");
Ground.물 = new Ground(5, "물");

/**
 * @param {number} id
 * @return {!Ground}
 */
Ground.getById = function(id)
{
    var ground = grounds[id];
    if (ground) return ground;
    return Ground.unknown;
};

module.exports = Ground;