
cc.Class({
    extends: cc.Component,

    properties: {
        img:cc.Prefab,
    },
    onLoad(){
        this.shieldS=cc.find("Canvas/Lead/shieldS").getComponent("ShieldS");
        this.PassiveSkills=cc.find("Canvas/GameUI/Top/Player state/Passive skills");
    },
    onCollisionEnter: function (other, self) {
        if(other.node.group=="player"){
            self.node.destroy();

            if(G.shieldNum>=4){
                return;
            }

            G.shieldNum++;
            //添加护盾
            this.shieldS.addshield();
            //被动技能上面 增加护盾图标
            var item=cc.instantiate(this.img);
            item.parent=this.PassiveSkills;
        }
    },
});
