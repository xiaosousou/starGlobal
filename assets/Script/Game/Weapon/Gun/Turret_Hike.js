cc.Class({
    extends: cc.Component,

    properties: {
        bullet:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.timer=0;
    },
    addbullet:function(xl){
        var item=cc.instantiate(this.bullet);
        item.parent=cc.find("Canvas/bullet");
        item.setPosition(cc.find("Canvas/bullet").convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(this.node.children[0])));
        item.getComponent("HikeBullet").init(xl,0);
    },
    update (dt) {
        if(G.gamestart==false||G.startenemy==false){
            return;
        }
        this.timer+=dt;
        if(this.timer>0.3){
            this.timer=0;
            var worldPos0=this.node.parent.convertToWorldSpaceAR(this.node.getPosition());
            var worldPos1=this.node.convertToWorldSpaceAR(this.node.children[0]);
            var xl=worldPos1.sub(worldPos0).normalize();
            this.addbullet(xl);
        }
    },
});
