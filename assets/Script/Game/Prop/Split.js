
cc.Class({
    extends: cc.Component,

    properties: {
        img:cc.Prefab,
    },
    onLoad(){
        this.PassiveSkills=cc.find("Canvas/GameUI/Top/Player state/Passive skills");
    },
    onCollisionEnter: function (other, self) {

        if(other.node.group=="player"){
            //this.node.getComponent("Prop Attract").die=true;
            // var pos1 = G.player.node.parent.convertToWorldSpaceAR(G.player.node.getPosition());

            // var pos2 = this.PassiveSkills.convertToNodeSpaceAR(pos1);
            var item=cc.instantiate(this.img);
            item.parent=this.PassiveSkills;
            
            G.split=true;
            self.node.destroy();
        }
    },
});
