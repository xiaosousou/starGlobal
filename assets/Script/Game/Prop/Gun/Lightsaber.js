
cc.Class({
    extends: cc.Component,

    properties: {
        LightsaberGun:cc.Prefab,
    },
    onCollisionEnter: function (other, self) {
        if(other.node.group=="player"){
            var item=cc.instantiate(this.LightsaberGun);
            item.parent=other.node.children[0].children[0];
            item.children[0].getComponent(cc.Animation).play();
            other.node.children[0].children[0].getComponent("TurretS").changeturretangle();
            self.node.destroy();
        }
    },
});
