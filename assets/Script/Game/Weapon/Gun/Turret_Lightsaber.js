cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad(){
        this.BossInjured = function () {
            this.Boss.node.getComponent("Boss").Injured(1);
        }
    },
    onCollisionEnter: function (other, self) {
        if(other.node.group=="boss"&&other.tag==0){
            this.Boss=other;
            other.node.getComponent("Boss").Injured(1);
            this.schedule(this.BossInjured, 0.2);

        }
    },
    onCollisionStay: function (other, self) {
        
    },
    onCollisionExit: function (other, self) {
        if(other.node.group=="boss"){
            this.unschedule(this.BossInjured);
        }
    }

    // update (dt) {},
});
