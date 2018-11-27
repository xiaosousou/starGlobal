
cc.Class({
    extends: cc.Component,

    properties: {
        turret:cc.Prefab,
        Fragment:cc.Prefab,
    },
    onLoad(){
        //当前得到的碎片数量
        this.FragmentNum=0;
        //当前的炮塔数量
        this.nowturretNum=0;
    },
    
    //所有炮台归位
    changeAllangle:function(){
        //第8個炮臺 就不再歸位了
        if(G.turretNum>=8){
            cc.log("第8個進入");
            //删除自己了
            this.node.destroy();
            return;
        }
        this.node.parent.getComponent("TurretS").changeturretangle();
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

        //炮台数增加
        G.turretNum++;
        //删除碎片
        this.node.children[1].removeAllChildren();
        //炮塔归位
        this.changeAllangle();
    },
    //添加碎片效果
    addFragment:function(angle){
        //添加碎片
        var item=cc.instantiate(this.Fragment);
        item.setPosition(cc.v2(0,0));
        //设置角度 角度减去 当前引力圈的旋转角度
        item.rotation=angle-this.node.parent.rotation;
        //添加到引力换的 碎片节点
        item.parent=this.node.children[1];


        //回调
        var finished = cc.callFunc(function() {
            //如果碎片没有碎片 那么我缩小0.33倍
            if(this.FragmentNum==0){
                item.children[0].scale=0.33;
            //如果有一个碎片 那么我缩小0.66倍
            }else if(this.FragmentNum==1){
                item.children[0].scale=0.66;
            }
            //当前碎片增加
            this.FragmentNum++;
        }, this);//动作完成后增加碎片
        //创建顺序动作
        var seq = cc.sequence(cc.rotateTo(0.5,90), finished);
        // 执行动作
        item.runAction(seq);
        
    },


    update(){
        //如果碎片3个了 就添加一个炮台
        if(this.FragmentNum>=3){
            this.FragmentNum=0;
            this.addTurret();
        }
    }
});
