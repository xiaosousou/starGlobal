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
        //this.timer=0;
        this.die=false;

        this.hike=false;//是否被黑
        this.enemyfollownode=null;//找到的节点
        this.enemyfollow=false;//是否找到了 最近的
        this.xl=null;
        this.timer=0;
    },

    onCollisionEnter: function (other, self) {
        if(other.node.group=="player"&&self.tag==0){
            other.node.getComponent("Player").bloodNum-=5;
            other.node.getComponent("Player").Injured();

            
            var selfpos=this.node.parent.convertToWorldSpaceAR(this.node.getPosition());
            var otherpos=other.node.convertToNodeSpaceAR(selfpos);
            this.node.parent=other.node;
            this.node.setPosition(otherpos);
            //other.node.getComponent("Player").Injured();
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
    onCollisionStay: function (other, self) {
        // if(other.node.group=="push"){
        //     //碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        //     var world = self.world;

        //     // 碰撞组件的 aabb 碰撞框
        //     var aabb = world.aabb;

        //     // 上一次计算的碰撞组件的 aabb 碰撞框
        //     var preAabb = world.preAabb;
        //     var r = world.radius;

        //     var offsetX = aabb.x - preAabb.x;
        //     var offsetY = aabb.y - preAabb.y;
        //     if(offsetX != 0) offsetX = offsetX/Math.abs(offsetX) * 2;
        //     if(offsetY != 0) offsetY = offsetY/Math.abs(offsetX) * 2;
        //     var point = cc.v2(preAabb.x,preAabb.y).add(cc.v2(r - offsetX, r - offsetY));
        //     var Nodepoint = this.node.parent.convertToNodeSpaceAR(point);
        //     this.node.setPosition(Nodepoint);

        //     // var world = self.world;

        //     // var r = world.radius;
        //     // var p = world.position;

        //     // this.node.setPosition(this.node.parent.convertToNodeSpaceAR(p));
        //     // cc.log("总共",world,"半径",r,"位置",p);

        // }
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
                    var enemylength=0;//找出最近距离 离我
                    var length=0;
                    for(var i in this.enemynode.children){
                        //对方向量
                        length=this.enemynode.children[i].getPosition().sub(this.node.getPosition());
        
                        if(length.mag()<=1000){
                            if(enemylength==0){
                                enemylength=length.mag();
                                this.enemyfollownode=this.enemynode.children[i];
                                this.enemyfollow=true;
                            }else if(length.mag()<enemylength){
                                enemylength=length.mag();
                                this.enemyfollownode=this.enemynode.children[i];
                            }
                        }
                    }
                    for(var i in this.Bossnode.children){
                        //都计算一下距离
                        length=this.Bossnode.children[i].getPosition().sub(this.node.getPosition());
        
        
                        if(length.mag()<=1000){
                            if(enemylength==0){
                                enemylength=length.mag();
                                this.enemyfollownode=this.Bossnode.children[i];
                                this.enemyfollow=true;
                            }else if(length.mag()<enemylength){
                                enemylength=length.mag();
                                this.enemyfollownode=this.Bossnode.children[i];
                            }
                        }
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
                    

                    //cc.log("追踪的向量",posSub,"追踪的人 ",this.enemyfollownode.getPosition());

                }
                



            }
            //角度 因爲角度一開始 減少了90度
            var angle=Math.atan2(this.xl.y, this.xl.x) / Math.PI * 180 *-1 + 90;
            this.node.rotation=angle;
            this.node.y+=120*this.xl.y*dt;
            this.node.x+=120*this.xl.x*dt;







            if(Math.abs(this.node.x)>this.node.parent.width/2){
                this.node.destroy();
            }
            if(Math.abs(this.node.y)>this.node.parent.height/2){
                this.node.destroy();
            }
        }
        
    },
});
