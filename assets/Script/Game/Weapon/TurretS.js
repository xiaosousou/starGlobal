cc.Class({
    extends: cc.Component,

    properties: {
        //turret:cc.Prefab,
    },

    onLoad () {

    },
    //播放显示炮台 出現 动画
    ShowTurret:function(){
        this.changeturretangle();
        for(var n in this.node.children){
            //让每个炮台 播放出现动画
            this.node.children[n].children[0].getComponent(cc.Animation).play();
        }
    },
    //让每个炮台归位
    changeturretangle:function(){
        for(var n in this.node.children){
            this.node.children[n].getComponent("Turret_Homing").changeangle(360/this.node.childrenCount*n);
        }
    },
    update (dt) {
        //添加敌人 的时候 就开始旋转
        if(G.gamestart==false||G.startenemy==false){
            return;
        }
        
        if(this.node.rotation<-180){
            this.node.rotation=180;
        }
        this.node.rotation-=60*dt;
    },
});
