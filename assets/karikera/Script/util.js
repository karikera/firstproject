module.exports = {            
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
};
