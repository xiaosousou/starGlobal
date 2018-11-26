
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onCollisionEnter: function (other, self) {
        if(other.node.group=="player"){
            self.node.destroy();
        }
    },
});
