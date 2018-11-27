
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
            //将图标 添加到 顶部被动技能显示
            var item=cc.instantiate(this.img);
            item.parent=this.PassiveSkills;
            //子弹分裂开启
            G.split=true;
            self.node.destroy();
        }
    },
});
