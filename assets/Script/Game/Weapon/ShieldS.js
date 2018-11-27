cc.Class({
    extends: cc.Component,

    properties: {
        shield:cc.Prefab,
    },  

    //添加护盾
    addshield:function(){
        var item=cc.instantiate(this.shield);
        item.parent=this.node;
        item.children[0].getComponent(cc.Animation).play();
        item.children[0].getComponent(cc.Animation).on('finished',  this.changeturretangle,    this);//动画播放完毕 让炮台归位
    },

    //让每个护盾归位
    changeturretangle:function(){
        for(var n in this.node.children){
            var rotateTo = cc.rotateTo(2, 360/this.node.childrenCount*n);
            this.node.children[n].runAction(rotateTo);
        }
    },

    update(dt){
        //添加敌人 的时候 就开始旋转
        if(G.gamestart==false||G.startenemy==false){
            return;
        }
        if(this.node.rotation>180){
            this.node.rotation=-180;
        }
        this.node.rotation+=100*dt;
    },
});
