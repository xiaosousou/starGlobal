cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.ball=cc.find("Canvas/Lead");
        this.anim=this.node.getComponent(cc.Animation);
        // this.timer=0;
        this.die=false;

        //爆炸之後碰撞到了角色
        this.PengzhuangPlayer=false;
    },

    onCollisionEnter: function (other, self) {
        //TAG   0
        //如果在開始碰撞就碰撞到了 角色 之後的持續碰撞就不檢測了
        if(other.node.group=="player"&&self.tag==0){
            other.node.getComponent("Player").bloodNum-=10;
            other.node.getComponent("Player").Injured();
            this.PengzhuangPlayer=true;
            this.Boom();
        }
        if(other.node.group=="bullet"&&self.tag==0){    
            this.Boom();
        }
       
        if(other.node.group=="push"&&self.tag==0){
            this.Boom();
        }
        if(other.node.group=="Lightsaber"&&self.tag==0){
            this.Boom();
        }
        if(other.node.group=="hikeEnemy"&&self.tag==0){
            self.node.destroy();
        }



        //Tag  1
        if(other.node.group=="enemy"&&self.tag==1){
            other.node.destroy();
        }
    },
    onCollisionStay: function (other, self) {
        //如果是爆炸波及了 就傷害一次
        if(other.node.group=="player"&&self.tag==1&&this.PengzhuangPlayer==false){
            other.node.getComponent("Player").bloodNum-=10;
            other.node.getComponent("Player").Injured();
            this.PengzhuangPlayer=true;
        }
        //爆炸了引爆了爆炸怪
        if(other.node.group=="EnemyBlasting"&&self.tag==1&&other.tag==0){
            other.node.getComponent("EnemyBlasting").Boom();
        }
    },
    die1:function(){
        this.node.destroy();
    },
    //爆炸
    Boom:function(){
        this.die=true;
        this.anim.play();
    },

    update (dt) {
        if(G.gamestart==false||this.die){
            return;
        }

        //向量归一
        var posSub=this.ball.getPosition().sub(this.node.getPosition()).normalize();
        //角度 因爲角度一開始 減少了90度
        var angle=Math.atan2(posSub.y, posSub.x) / Math.PI * 180 * -1 + 90;

        this.node.rotation=angle;
        this.node.y+=80*posSub.y*dt;
        this.node.x+=80*posSub.x*dt;
    },
});
