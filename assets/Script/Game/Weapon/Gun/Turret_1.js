cc.Class({
    extends: cc.Component,

    properties: {
        bullet:cc.Prefab,
    },
    onLoad () {
        this.timer=0;//发射子弹
    },
    //添加子弹
    addbullet:function(xl){
        var item=cc.instantiate(this.bullet);
        //添加子弹到子弹节点
        item.parent=cc.find("Canvas/bullet");
        //子弹添加到我炮塔的坐标
        item.setPosition(cc.find("Canvas/bullet").convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(this.node.children[0])));
        //初始化子弹(向量，是否是第一次发射(是第一次 可以破碎)) 
        item.getComponent("Bullet").init(xl,0);
    },
    update (dt) {
        if(G.gamestart==false||G.startenemy==false){
            return;
        }


        //0.3秒发射子弹
        this.timer+=dt;
        if(this.timer>0.3){
            this.timer=0;
            //我的世界坐标
            var worldPos0=this.node.parent.convertToWorldSpaceAR(this.node.getPosition());
            //我的炮塔显示的坐标
            var worldPos1=this.node.convertToWorldSpaceAR(this.node.children[0]);
            //炮塔所面对的向量
            var xl=worldPos1.sub(worldPos0).normalize();
            //将向量给子弹
            this.addbullet(xl);
        }
    },
});
