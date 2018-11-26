cc.Class({
    extends: cc.Component,

    properties: {

    },
    //通过角度发射子弹
    init(angle){
        this.xl=cc.v2(Math.cos(angle*Math.PI/180), Math.sin(angle*Math.PI/180));;
        this.node.rotation=-Math.atan2(this.xl.y, this.xl.x) / Math.PI * 180 - 90;
    },

    onCollisionEnter: function (other, self) {
        if(other.node.group=="player"&&other.tag==0){
            other.node.getComponent("Player").bloodNum-=5;
            other.node.getComponent("Player").Injured();
            this.node.destroy();
        }
        if(other.node.group=="hikeEnemy"){
            self.node.destroy();
        }
        if(other.node.group=="shield"){
            self.node.destroy();
        }
    },

    update (dt) {
        if(Math.abs(this.node.x)>this.node.parent.width/2){
            this.node.destroy();
        }
        if(Math.abs(this.node.y)>this.node.parent.height/2){
            this.node.destroy();
        }

        this.node.x+=this.xl.x*200*dt;
        this.node.y+=this.xl.y*200*dt;
    },
});
