
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
            this.shieldS.addshield();
            var item=cc.instantiate(this.img);
            item.parent=this.PassiveSkills;
        }
    },
});
