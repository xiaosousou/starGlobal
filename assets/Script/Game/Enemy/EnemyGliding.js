cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.Lead=cc.find("Canvas/Lead");
        this.anim=this.node.getComponent(cc.Animation);
        // this.timer=0;
        this.die=false;
        this.Pos=this.node.getPosition();

        this.xl=this.Lead.getPosition().sub(this.node.getPosition()).normalize();

        var hudu=Math.atan2(this.xl.y, this.xl.x);
        this.node.rotation=- hudu / Math.PI * 180 + 90

    },

    onCollisionEnter: function (other, self) {
        if(other.node.group=="player"&&self.tag==0){
            other.node.getComponent("Player").bloodNum-=5;
            other.node.getComponent("Player").Injured();

            
            var selfpos=this.node.parent.convertToWorldSpaceAR(this.node.getPosition());
            var otherpos=other.node.convertToNodeSpaceAR(selfpos);
            this.node.parent=other.node;
            this.node.setPosition(otherpos);
            //other.node.getComponent("Player").Injured();
            this.die=true;
            this.anim.play("Hit");
        }
        if(other.node.group=="bullet"&&self.tag==0){
            self.node.destroy();
        }
        if(other.node.group=="push"&&self.tag==0){
            this.node.destroy();
        }
        if(other.node.group=="Lightsaber"&&self.tag==0){
            this.node.destroy();
        }
        // if(other.node.group=="shield"&&self.tag==0){
        //     self.node.destroy();
        // }
    },
    die1:function(){
        this.node.destroy();
    },

    update (dt) {
        if(G.gamestart==false||this.die){
            return;
        }


        if(this.Pos.x<0&&this.node.x>this.node.parent.width/2){
            this.node.destroy();
        }else if(this.Pos.x>0&&this.node.x<-this.node.parent.width/2){
            this.node.destroy();
        }

        if(this.Pos.y>0&&this.node.y<-this.node.parent.height/2){
            this.node.destroy();
        }else if(this.Pos.y<0&&this.node.y>this.node.parent.height/2){
            this.node.destroy();
        }


        this.node.y+=800*this.xl.y*dt;
        this.node.x+=800*this.xl.x*dt;

    },
});
