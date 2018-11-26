cc.Class({
    extends: cc.Component,

    properties: {

    },
    onCollisionEnter: function (other, self) {
        if(other.node.group=="player"){
            G.player.bloodNum+=60;
            self.node.destroy();
        }
    },
});
