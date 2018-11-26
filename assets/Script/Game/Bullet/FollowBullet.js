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
        
        //cc.log("自己角度",-(this.node.rotation-90));
        //var hudu=this.node.rotation*Math.PI/180;
        //cc.log("向量",this.xl,"向量转角度",this.node.rotation,"角度转向量",cc.v2(Math.sin(hudu), Math.cos(hudu)));
    },
    onLoad(){

        this.enemynode=cc.find("Canvas/enemys");
        this.Bossnode=cc.find("Canvas/boss");
        this.enemyfollownode=null;//找到的节点
        this.enemyfollow=false;//是否找到了 最近的
    },
    onCollisionEnter: function (other, self) {
        if(other.node.group=="enemy"&&other.tag==0){
            self.node.destroy();
        }
        if(other.node.group=="EnemyBlasting"&&other.tag==0){
            self.node.destroy();
        }
        if(other.node.group=="boss"&&other.tag==0){
            other.node.getComponent("Boss").Injured(0.5);
            self.node.destroy();  
        }
    },
    update (dt) {
        if(G.gamestart==false){
            return;
        }



        if(this.enemyfollow==false){
            var enemylength=0;//找出最近距离 离我
            var length=0;
            for(var i in this.enemynode.children){
                //对方向量
                length=this.enemynode.children[i].getPosition().sub(this.node.getPosition());
                //自己向量
                var hudu=this.node.rotation*Math.PI/180;
                var xl=cc.v2(Math.sin(hudu), Math.cos(hudu));

                if(length.mag()<=400&&Math.abs(length.signAngle(xl))<Math.PI/2){
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
                //自己向量
                var hudu=this.node.rotation*Math.PI/180;
                var xl=cc.v2(Math.sin(hudu), Math.cos(hudu));


                if(length.mag()<=400&&Math.abs(length.signAngle(xl))<Math.PI/2){
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


        }else{
            //如果节点消失了 就跳出 重新找
            if(!cc.isValid(this.enemyfollownode)){
                this.enemyfollow=false;
                return;
            }else{
                //更新追踪的节点向量
                this.xl=this.enemyfollownode.getPosition().sub(this.node.getPosition()).normalize();
                //自己向量
                var hudu=this.node.rotation*Math.PI/180;
                var xl=cc.v2(Math.sin(hudu), Math.cos(hudu));
                


                //向量叉乘 >0 逆时针方向旋转
                //cc.log("向量叉乘",xl.cross(this.xl),"我和敌人的角度",this.xl.signAngle(xl));

                //this.enabled=false;


                if(xl.cross(this.xl)>0&&Math.abs(xl.cross(this.xl))>0.1){
                    this.node.rotation-=150*dt;
                }else{
                    this.node.rotation+=150*dt;
                }
            }
            
        }

        
        
        
                


        var hudu=this.node.rotation*Math.PI/180;
        var xl=cc.v2(Math.sin(hudu), Math.cos(hudu))
        this.node.x+=xl.x*500*dt;
        this.node.y+=xl.y*500*dt;  

        //this.node.rotation+=10;
            















        

        if(Math.abs(this.node.x)>this.node.parent.width/2){
            this.node.destroy();
        }
        if(Math.abs(this.node.y)>this.node.parent.height/2){
            this.node.destroy();
        }
    },
    // update (dt) {},
});
