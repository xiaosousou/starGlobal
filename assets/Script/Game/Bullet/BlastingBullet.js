cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    init(xl,num){
        //得到出生时的向量
        this.xl=xl;
        //判斷是不是第一次創建  子彈破碎后 只爆一次
        this.num=num;
        //向量转角度
        this.node.rotation=-Math.atan2(xl.y, xl.x) / Math.PI * 180 + 90;
        //死亡了
        this.die=false;
    },
    onLoad(){
        this.anim=this.node.getComponent(cc.Animation);
        this.timer=0;//飞出去计时
        this.PengZhuangBoss=false;//是否碰到boss
    },
    onCollisionEnter: function (other, self) {
        if(other.node.group=="enemy"&&self.tag==0&&other.tag==0){
            this.Boom();
        }
        // if(other.node.group=="enemy"&&self.tag==1&&other.tag==0){
        //     other.node.destroy();
        // }

        if(other.node.group=="EnemyBlasting"&&self.tag==0&&other.tag==0){
            this.Boom();
        }

        if(other.node.group=="boss"&&self.tag==0&&other.tag==0&&this.PengZhuangBoss==false){
            this.PengZhuangBoss=true;
            other.node.getComponent("Boss").Injured(2);
            this.Boom();
        }
    },
    onCollisionStay: function (other, self) {

        if(other.node.group=="boss"&&self.tag==1&&other.tag==0&&this.PengZhuangBoss==false){
            this.PengZhuangBoss=true;
            other.node.getComponent("Boss").Injured(2);
        }
    },
    Boom:function(){
        this.die=true;
        this.anim.play();
    },
    die1:function(){
        this.node.destroy();
    },
    update (dt) {
        if(G.gamestart==false||this.die==true){
            return;
        }
        if(Math.abs(this.node.x)>this.node.parent.width/2){
            this.node.destroy();
        }
        if(Math.abs(this.node.y)>this.node.parent.height/2){
            this.node.destroy();
        }
        this.node.x+=this.xl.x*500*dt;
        this.node.y+=this.xl.y*500*dt;

        this.timer+=dt;
        if(this.timer>=0.9){
            this.die=true;
            this.anim.play();
        }
    },


});
