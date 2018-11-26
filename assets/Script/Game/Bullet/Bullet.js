cc.Class({
    extends: cc.Component,

    properties: {

    },
    init(xl,num){
        //得到出生时的向量
        this.xl=xl;
        //判斷是不是第一次創建  子彈破碎后 只爆一次
        this.num=num;
        //向量转角度
        this.node.rotation=-Math.atan2(xl.y, xl.x) / Math.PI * 180 + 90;
    },

    onCollisionEnter: function (other, self) {
        if(other.node.group=="enemy"&&other.tag==0){
            if(G.split&&this.num==0){
                this.bulletdivision();
                self.node.destroy();
            }else{
                self.node.destroy();
            }
        }
        if(other.node.group=="boss"&&other.tag==0){
            other.node.getComponent("Boss").Injured(1);
            if(G.split&&this.num==0){
                this.bulletdivision();
                self.node.destroy();
            }else{
                self.node.destroy();
            }
        }
    },
    //子彈分裂
    bulletdivision:function(){
        for(var i=-1;i<2;i++){
            var angle=Math.atan2(this.xl.y, this.xl.x) / Math.PI * 180;
            var hudu=(angle-15*i)*Math.PI/180;              
            var xl=cc.v2(Math.cos(hudu), Math.sin(hudu));
    
            var item=cc.instantiate(this.node);
            item.parent=this.node.parent;
            item.setPosition(this.node.getPosition());
            item.getComponent("Bullet").init(xl,1);
        }
        
    },

    update (dt) {
        if(G.gamestart==false){
            return;
        }
        if(Math.abs(this.node.x)>this.node.parent.width/2){
            this.node.destroy();
        }
        if(Math.abs(this.node.y)>this.node.parent.height/2){
            this.node.destroy();
        }
        this.node.x+=this.xl.x*500*dt;
        this.node.y+=this.xl.y*500*dt;
    },
});
