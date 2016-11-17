
var grounds = {};

/**
 * @author karikera
 * @description 지반 클래스에요!
 * @param {number} id Tiled에서 아이디
 * @param {string} name 이름
 */
function Ground(id, name)
{
    grounds[id] = this;
	this.id = id; 
    this.name = name;
}

Ground.prototype.id = -1;
Ground.prototype.name = "";

Ground.prototype.toString = function()
{
    return "[지반:"+this.name+"#"+this.id+"]";
};

Ground.unknown = new Ground(0, "unknown");
Ground.암석 = new Ground(1, "암석");
Ground.흙 = new Ground(2, "흙");

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