
var util = require('./util');

/**
 * @author karikera
 * @description 지반 클래스에요!
 * @param {string} name 이름
 */
function Ground(name)
{
    this.name = name;
}

Ground.prototype.name = "";

Ground.prototype.toString = function()
{
    return "[지반:"+this.name+"]";
};

Ground.unknown = new Ground("unknown");

var grounds = {};

grounds[1] = new Ground("암석");
grounds[2] = new Ground("흙");

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

/**
 * @author karikera
 * @description layer의 point 타일 좌표에서 타일을 가져와요!
 * @param {cc.TiledLayer} layer
 * @param {cc.Vec2} point
 * @return {Ground}
 */
Ground.get = function(layer, point)
{
    return Ground.getById(layer.getTileGIDAt(point));
};

/**
 * @author karikera
 * @description layer 의 point 좌표에서 타일을 가져와요!
 * @param {cc.TiledLayer} layer
 * @param {cc.Vec2} point
 * @return {Ground}
 */
Ground.pick = function(layer, point)
{
    point.x -= layer.xoff;
    point.y -= layer.yoff;
    return Ground.get(util.toTileCoord(point));
};

module.exports = Ground;