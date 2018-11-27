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
        
    },
    onLoad(){
        this.enemynode=cc.find("Canvas/enemys");
        this.Bossnode=cc.find("Canvas/boss");

        this.enemyfollownode=null;//找到的节点
        this.enemyfollow=false;//是否找到了 跟踪的敌人

        this.timer=0;//循环查找敌人 的间隔
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
            //如果没有找到 需要追踪的敌人
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
            if(!cc.isValid(this.enemyfollownode)){
                this.enemyfollow=false;
                return;
            }else{
                //更新追踪的节点向量
                this.xl=this.enemyfollownode.getPosition().sub(this.node.getPosition()).normalize();
                //自己向量
                var hudu=this.node.rotation*Math.PI/180;
                var xl=cc.v2(Math.sin(hudu), Math.cos(hudu));

                //通过判断敌人的向量和自己的向量 旋转自己的角度 如果向量叉乘<0.1 就停止旋转
                if(xl.cross(this.xl)>0&&Math.abs(xl.cross(this.xl))>0.1){
                    this.node.rotation-=150*dt;
                }else{
                    this.node.rotation+=150*dt;
                }
            }
            
        }

        
        //永远朝向自己的前方移动
        var hudu=this.node.rotation*Math.PI/180;
        var xl=cc.v2(Math.sin(hudu), Math.cos(hudu))
        
        this.node.x+=xl.x*500*dt;
        this.node.y+=xl.y*500*dt;  

        //超出屏幕 消失
        if(Math.abs(this.node.x)>this.node.parent.width/2){
            this.node.destroy();
        }
        if(Math.abs(this.node.y)>this.node.parent.height/2){
            this.node.destroy();
        }
    },
    //搜索飞机
    searchEnemy:function(){
        var followenemy=null;
        

        //自己向量
        var xl=cc.v2(Math.sin(this.node.rotation*Math.PI/180), Math.cos(this.node.rotation*Math.PI/180));
        var enemylength=0;//离我最近的一个敌人的距离 通过这个距离判断下一个是否比我近
        var length=0;//向量


        //循环所有敌人节点
        for(var i in this.enemynode.children){
            //对方向量
            length=this.enemynode.children[i].getPosition().sub(this.node.getPosition());
            //如果距离离我小于400 && 对方向量和我向量的弧度 小于90度
            if(length.mag()<=400&&Math.abs(length.signAngle(xl))<Math.PI/2){
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

            if(length.mag()<=400&&Math.abs(length.signAngle(xl))<Math.PI/2){
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
