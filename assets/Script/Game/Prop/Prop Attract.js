//吸引作用 靠近核心 就往核心跑
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.Lead=cc.find("Canvas/Lead");
        this.Attract=false;
    },
    //判断我和 核心的距离 如果距离 <=150 那么我就被核心吸引
    update (dt) {
        if(G.gamestart==false){
            return;
        }

        var LeadPos=this.Lead.getPosition();
        var selfPos=this.node.getPosition();

        if(this.Attract==false){
            var Leadlength=LeadPos.sub(selfPos).mag();
            if(Leadlength<=150){
                this.Attract=true;
            }
        }
        if(this.Attract==true){
            var xl=LeadPos.sub(selfPos).normalize();
            this.node.x+=xl.x * dt * 1000;
            this.node.y+=xl.y * dt * 1000;
        }
        
    },
});
