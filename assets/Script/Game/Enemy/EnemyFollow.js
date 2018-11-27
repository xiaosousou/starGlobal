cc.Class({
    extends: cc.Component,

    properties: {
        img:cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.ball=cc.find("Canvas/Lead");
        this.enemynode=cc.find("Canvas/enemys");
        this.Bossnode=cc.find("Canvas/boss");
        this.Hikeenemy=cc.find("Canvas/Hikeenemy");

        this.anim=this.node.getComponent(cc.Animation);
        this.die=false;

        this.hike=false;//是否被黑
        this.enemyfollownode=null;//找到的节点
        this.enemyfollow=false;//是否找到了 最近的
        this.xl=null;//自己行走的方向向量
        this.timer=0;//查找敌人间隔
    },

    onCollisionEnter: function (other, self) {
        if(other.node.group=="player"&&self.tag==0){
            other.node.getComponent("Player").bloodNum-=5;
            other.node.getComponent("Player").Injured();

            //播放撞到核心的动画
            var selfpos=this.node.parent.convertToWorldSpaceAR(this.node.getPosition());
            var otherpos=other.node.convertToNodeSpaceAR(selfpos);
            this.node.parent=other.node;
            this.node.setPosition(otherpos);
 
            this.die=true;
            this.anim.play("Hit");
        }

        
        if(other.node.group=="hikeBullet"&&self.tag==0){
            this.Hike();
        }


        if(other.node.group=="bullet"&&self.tag==0){
            self.node.destroy();
        }
        if(other.node.group=="push"&&self.tag==0){
            self.node.destroy();
        }
    
        if(other.node.group=="Lightsaber"&&self.tag==0){
            self.node.destroy();
        }
        if(other.node.group=="hikeEnemy"&&self.tag==0){
            self.node.destroy();
        }


        //被黑之后 碰到的情况

        if(other.node.group=="enemy"&&self.tag==0){
            self.node.destroy();
        }
        if(other.node.group=="boss"&&self.tag==0&&other.tag==0){
            other.node.getComponent("Boss").Injured(1);
            self.node.destroy();  
        }
        if(other.node.group=="bossbullet"&&self.tag==0){
            self.node.destroy();
        }
        if(other.node.group=="EnemyBlasting"&&self.tag==0){
            self.node.destroy();
        }
    },

    die1:function(){
        console.log("enemy消失");
        this.node.destroy();
    },
    //被黑
    Hike:function(){
        this.hike=true;
        this.node.parent=this.Hikeenemy;
        this.node.group="hikeEnemy";
        this.node.getComponent(cc.Sprite).spriteFrame=this.img;
    },
    update (dt) {
        if(G.gamestart==false||this.die){
            return;
        }

        if(this.hike==false){
            //向量归一
            this.xl=this.ball.getPosition().sub(this.node.getPosition()).normalize();
            //角度 因爲角度一開始 減少了90度
            var angle=Math.atan2(this.xl.y, this.xl.x) / Math.PI * 180 *-1 + 90;

            this.node.rotation=angle;
            this.node.y+=100*this.xl.y*dt;
            this.node.x+=100*this.xl.x*dt;
        }else{

            if(this.enemyfollow==false){

                this.timer+=dt;
                if(this.timer>=0.1){
                    this.timer=0;
                    var follownode=this.searchEnemy();
                    if(follownode!=null){
                        this.enemyfollownode=follownode;
                        this.enemyfollow=true;
                    }
                }

            }else{
                //如果节点消失了 就跳出 重新找
                if(!cc.isValid(this.enemyfollownode)||this.enemyfollownode.group=="hikeEnemy"){
                    //cc.log("节点消失 或者 变了");
                    this.enemyfollow=false;
                    return;
                }else{
                    //更新追踪的节点向量
                    this.xl=this.enemyfollownode.getPosition().sub(this.node.getPosition()).normalize();

                }
                
            }

            //角度 因爲角度一開始 減少了90度
            var angle=Math.atan2(this.xl.y, this.xl.x) / Math.PI * 180 *-1 + 90;
            this.node.rotation=angle;
            this.node.y+=120*this.xl.y*dt;
            this.node.x+=120*this.xl.x*dt;


            //超出屏幕 删除节点
            if(Math.abs(this.node.x)>this.node.parent.width/2){
                this.node.destroy();
            }
            if(Math.abs(this.node.y)>this.node.parent.height/2){
                this.node.destroy();
            }
        }
        
    },


    //搜索飞机
    searchEnemy:function(){
        var followenemy=null;
        
        //自己向量
        var enemylength=0;//离我最近的一个敌人的距离 通过这个距离判断下一个是否比我近
        var length=0;//向量


        //循环所有敌人节点
        for(var i in this.enemynode.children){
            //对方向量
            length=this.enemynode.children[i].getPosition().sub(this.node.getPosition());
            //如果距离离我小于400 && 对方向量和我向量的弧度 小于90度
            if(length.mag()<=1000){
                //如果这是第一个离我小于400的敌人的飞机
                if(enemylength==0){
                    //直接把这个飞机的距离设置为 判断飞机的距离
                    enemylength=length.mag();
                    //将这个飞机设置为 追踪的飞机
                    followenemy=this.enemynode.children[i];
                //如果这不是第一个离我小于400的飞机 并且离我比 判断飞机距离 近
                }else if(length.mag()<enemylength){
                    //判断飞机距离 设置为这个飞机的距离
                    enemylength=length.mag();
                    //设置这个飞机为追踪飞机
                    followenemy=this.enemynode.children[i];
                }
            }
        }
        //循环boss节点
        for(var i in this.Bossnode.children){
            //对方向量
            length=this.Bossnode.children[i].getPosition().sub(this.node.getPosition());

            if(length.mag()<=1000){
                if(enemylength==0){
                    enemylength=length.mag();
                    followenemy=this.Bossnode.children[i];
                }else if(length.mag()<enemylength){
                    enemylength=length.mag();
                    followenemy=this.Bossnode.children[i];
                }
            }
        }

        return followenemy;
    },
});
