const DX = 64; // karikera: 타일 가로 간격 
const DY = 32; // karikera: 타일 세로 간격
const DZ = 12; // karikera: 타일의 두께 세로 간격

/** @type{cc.Label} */
var debugLabel = null;

/** @type{cc.Node} */
var rootNode = null;

/**
 * @author karikera
 * @description 레이어 위치를 이동시켜요
 * @param {cc.TiledLayer} layer
 * @param {number} x
 * @param {number} y
 */
function moveLayer(layer, x, y)
{
    layer.xoff = x;
    layer.yoff = y;
    x *= 2;
    y *= 2;
    layer.setContentSize(
        util.tiledWidth + x, 
        util.tiledHeight + y);
}

var util = {
    tiledWidth: 0,
    tiledHeight: 0,
    mapOffsetX: 0,
    mapOffsetY: 0,
    layer1: null,
    layer2: null,

    /**
     * @author karikera
     * @description 타일맵 수치를 초기화해요!
     * @param {GameScene} gameScene
     */
    init: function(gameScene)
    {
        rootNode = gameScene.node;
        /** @type{cc.TiledMap} */
        var tiledmap = rootNode.getComponent(cc.TiledMap);
        /** @type{cc.TiledLayer} */
        var layer1 = tiledmap.getLayer("Under 1");
        /** @type{cc.TiledLayer} */
        var layer2 = tiledmap.getLayer("Under 2");
        util.layer1 = layer1;
        util.layer2 = layer2;
        
        var tilesize = tiledmap.getTileSize();
        var mapsize = tiledmap.getMapSize();
        util.tiledWidth = tilesize.width * mapsize.width;
        util.tiledHeight = tilesize.height * mapsize.height;
        var firstCoord = layer1.getPositionAt(0,0);
        util.mapOffsetX = firstCoord.x - util.tiledWidth/2 + DX / 2;
        util.mapOffsetY = firstCoord.y - util.tiledHeight/2 + DY / 2 + DZ;
        moveLayer(layer1, 0, 0);
        moveLayer(layer2, 0, DZ);
    },

    // author: karikera
    // 장면 상대 좌표에서 타일 좌표를 계산해요!
    toTileCoord: function(point)
    {
        var x = (point.x - util.mapOffsetX) / DX;
        var y = (point.y - util.mapOffsetY) / DY;
        var tx = Math.round(x - y);
        var ty = Math.round(- y - x);
        return cc.p(tx, ty);
    },
   
    // author: karikera
    // node에 발생하는 마우스 이벤트를 target.onMouse* 함수로 받을 수 있게 연결해요
    linkMouseEvent: function(node, target)
    {
        if (target.onMouseDown) node.on(cc.Node.EventType.MOUSE_DOWN, target.onMouseDown.bind(target));
        if (target.onMouseUp) node.on(cc.Node.EventType.MOUSE_UP, target.onMouseUp.bind(target));
        if (target.onMouseMove) node.on(cc.Node.EventType.MOUSE_MOVE, target.onMouseMove.bind(target));
        if (target.onMouseEnter) node.on(cc.Node.EventType.MOUSE_ENTER, target.onMouseEnter.bind(target));
        if (target.onMouseLeave) node.on(cc.Node.EventType.MOUSE_LEAVE, target.onMouseLeave.bind(target));
    },

    // author: karikera
    // node에 발생하는 키보드 이벤트를 target.onKey* 함수로 받을 수 있게 연결해요
    linkKeyEvent: function(node, target)
    {
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: target.onKeyPressed.bind(target),
            onKeyReleased: target.onKeyReleased.bind(target)
        }, node);  
    },

    // author: karikera
    // 좌표에 + 표시를 넣는 기능인데 안되네요 ( . . . ) . .
    /**
     * @param {cc.Node} parent 
     * @param {cc.Color} color
     * @param {number} x
     * @param {number} y
    */
    addMark: function(parent, color, x, y)
    {
        console.log(x, y);
        var node = new cc.Node;
        node.setPosition(x, y);
        /** @type{cc.Graphics} */
        var g = node.addComponent(cc.Graphics);
        g.update = function()
        {
            g.clear();
            g.strokeColor = color;
            g.moveTo(-10, 0);
            g.lineTo(10, 0);
            g.moveTo(0, -10);
            g.lineTo(0, 10);
            g.stroke();
        };
        parent.addChild(node);
        node.zIndex = 10000;
    },

    /**
     * @author karikera
     * @param {cc.Component} component
     * @param {Array.<string>} fields
     */
    showDebugLabel: function(component, fields)
    {
        if (debugLabel === null)
        {
            var node = new cc.Node;
            node.zIndex = 10000;
            /** @type {cc.Label} */
            debugLabel = node.addComponent(cc.Label);
            debugLabel.fontSize = 20;
        }
        var text = "";
        for(var i=0;i<fields.length;i++)
        {
            var p = fields[i];
            text += p +": " + component[p]+"\n";
        }  
        var op = debugLabel.node.parent;
        var np = component.node.parent;
        if (op !== np)
        {
            if(op) op.removeChild(debugLabel.node);
            np.addChild(debugLabel.node);
        }
        debugLabel.node.x = component.node.x;
        debugLabel.node.y = component.node.y;
        debugLabel.string = text.substr(0, text.length-1); 
    },
};

module.exports = util;