cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {

        this.ball=cc.find("Canvas/Lead");//角色
        this.bulletnode=cc.find("Canvas/bullet");//子弹节点
        this.enemynode=cc.find("Canvas/enemys");//敌人节点
        this.bloodnum=50+(G.wave/5*50);//血量
        this.die=false;//是否死亡

    },

    Injured:function(num){
        this.bloodnum-=num;
        for(var i in this.node.children){
            this.node.children[i].color = cc.Color.RED;
            var action = cc.tintTo(0.3, 255, 255, 255);
            this.node.children[i].runAction(action);
        }
    },

    update (dt) {
        if(G.startenemy==false||this.die){
            return;
        }
        //向量归一
        var posSub=this.ball.getPosition().sub(this.node.getPosition()).normalize();
        this.node.y+=40*posSub.y*dt;
        this.node.x+=40*posSub.x*dt;


        if(this.bloodnum<=0){
            G.main.BossDie();
            this.enemynode.removeAllChildren();
            this.bulletnode.removeAllChildren();//清除子弹
            this.node.destroy();
        }

    },
});
