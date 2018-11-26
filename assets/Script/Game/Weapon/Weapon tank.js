
cc.Class({
    extends: cc.Component,

    properties: {
        turret:cc.Prefab,
        Fragment:cc.Prefab,
    },
    onLoad(){
        this.FragmentNum=0;
        this.nowturretNum=0;
    },
    //归位
    changeangle:function(angle){
        var rotateTo = cc.rotateTo(2, angle);
        this.node.runAction(rotateTo);
    },

    //添加炮台
    addTurret:function(){
        if(G.turretNum>=8){
            return;
        }
        var item=cc.instantiate(this.turret);
        item.parent=this.node.parent;
        item.children[0].getComponent(cc.Animation).play();
        item.setPosition(this.node.getPosition());
        G.turretNum++;
        //删除碎片
        this.deletFragment();
        //炮塔归位
        this.changeAllangle();
        //item.children[0].getComponent(cc.Animation).on('finished',  ,    this);//动画播放完毕 让炮台归位
    },
    //所有炮台归位
    changeAllangle:function(){
        //第8個炮臺 就不再歸位了
        if(G.turretNum>=8){
            cc.log("第8個進入");
            return;
        }
        this.node.parent.getComponent("TurretS").changeturretangle();
    },

    //添加碎片效果
    addFragment:function(angle){
        


        var item=cc.instantiate(this.Fragment);
        item.setPosition(cc.v2(0,0));
        item.rotation=angle-this.node.parent.rotation;
        item.parent=this.node.children[1];

        //回调
        var finished = cc.callFunc(function() {
            if(this.FragmentNum==0){
                item.children[0].scale=0.33;
            }else if(this.FragmentNum==1){
                item.children[0].scale=0.66;
            }
            this.FragmentNum++;
        }, this);//动作完成后增加碎片
        //创建顺序动作
        var seq = cc.sequence(cc.rotateTo(0.5,90), finished);
        // 执行动作
        item.runAction(seq);
        
    },

    //碎片组合成了 炮台 删除碎片
    deletFragment:function(){
        for(var i=0;i<3;i++){
            this.node.children[1].children[i].destroy();
        }
    },
    update(){
        //第8個了 就直接刪除 自己了
        if(G.turretNum>=8){
            this.node.destroy();
        }

        if(this.FragmentNum>=3){
            this.FragmentNum=0;
            this.addTurret();
        }
    }
});
