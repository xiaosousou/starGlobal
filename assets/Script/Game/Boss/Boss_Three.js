cc.Class({
    extends: cc.Component,

    properties: {
        bullet:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.timer=0;//发射子弹
        this.bulletnode=cc.find("Canvas/bullet");//子弹节点
        this.bulletAngel=0;
    },
    //发射子弹
    shooting:function(){
        for(var i=0;i<360;i+=30){
            var item=cc.instantiate(this.bullet);
            item.parent=this.bulletnode;
            item.setPosition(this.node.getPosition());
            item.getComponent("BossBullet").init(i+this.bulletAngel);
            
        }
        this.bulletAngel+=5;
    },
    update (dt) {
        if(G.startenemy==false){
            return;
        }
        this.timer+=dt;
        if(this.timer>=1.5){
            this.timer=0;
            this.shooting();
        }
    },
});
