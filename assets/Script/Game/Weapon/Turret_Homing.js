
cc.Class({
    extends: cc.Component,

    properties: {

    },
    //归位
    changeangle:function(angle){
        var rotateTo = cc.rotateTo(2, angle);
        this.node.runAction(rotateTo);
    },
});
