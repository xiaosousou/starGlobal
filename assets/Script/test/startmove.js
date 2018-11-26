cc.Class({
    extends: cc.Component,

    properties: {
        share:cc.Animation,
        like:cc.Animation,
        leadboard:cc.Animation,
        space:cc.Animation,
        swipe:cc.Node,
        gravitation:cc.Animation,
        lead:cc.Animation,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 使用枚举类型来注册
        var self=this;
        self.node.on(cc.Node.EventType.TOUCH_START, self.touchMove, self);
    },
    touchMove:function(){
        this.share.play();
        this.like.play();
        this.leadboard.play();
        this.space.play();
        this.gravitation.play();
        this.lead.play();
        this.swipe.active=false;
    }
    // update (dt) {},
});
