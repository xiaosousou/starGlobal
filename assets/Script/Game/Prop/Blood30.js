
cc.Class({
    extends: cc.Component,

    properties: {

    },
    onCollisionEnter: function (other, self) {
        if(other.node.group=="player"){
            G.player.bloodNum+=30;
            self.node.destroy();
        }
    },

});
