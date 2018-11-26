cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        G.player=this;

        this.bloodNum=100;
        this.blood=cc.find("Canvas/GameUI/Top/Player state/Blood strip/blood").getComponent(cc.ProgressBar);

        this.bulletnode=cc.find("Canvas/bullet");
        this.enemynode=cc.find("Canvas/enemys");


        this.dieAnim=this.node.getComponent(cc.Animation);
        // this.collisionBoss=false;//是否碰到boss
        // this.timer=0;//碰到之后计时 受伤
    },
    Injured:function(){
        this.node.color = cc.Color.RED;
        var action = cc.tintTo(0.3, 255, 255, 255);
        this.node.runAction(action);
    },

    die1:function(){
        G.main.gameover1();
        this.node.destroy();
    },
    update (dt) {
        if(Math.abs(this.blood.progress-this.bloodNum/100)>0.005){
            if(this.blood.progress<this.bloodNum/100){
                this.blood.progress+=dt*0.5;
            }else if(this.blood.progress>this.bloodNum/100){
                this.blood.progress-=dt*0.5;
            }
        }else if(this.bloodNum<=0){
            this.blood.progress=0;
        }

        if(G.gamestart==false||this.die){
            return;
        }

        if(this.bloodNum>100){
            this.bloodNum=100;
        }

        if(this.bloodNum<=0){
            this.node.children[0].active=false;
            this.bulletnode.removeAllChildren();
            this.enemynode.removeAllChildren();
            this.dieAnim.play("Lead");
            G.gamestart=false;
            
        }


        // if(this.collisionBoss){
        //     this.timer+=dt;
        //     if(this.timer>=0.5){
        //         this.timer=0;
        //         this.bloodNum-=5;
        //         this.Injured();
        //         cc.log("碰到敌人");
        //     }
        // }

    },
});
