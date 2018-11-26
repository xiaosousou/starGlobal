// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        turret:cc.Prefab,
        weapon:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.timer=0;
        //this.node.getComponent("defense").changeturretangle();
    },
    addturret:function(){
        var item=cc.instantiate(this.turret);
        item.parent=this.node;
        this.node.getComponent("defense").changeturretangle();
    },
    addweapon:function(){
        var item=cc.instantiate(this.weapon);
        item.parent=this.node;
        this.node.getComponent("defense").changeturretangle();
    },
    update(dt){
        this.timer+=dt;
        if(this.timer>0.1){
            this.timer=0;
            //this.addturret();
            //this.addweapon();
        }
    },
});
