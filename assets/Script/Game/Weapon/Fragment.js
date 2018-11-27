
cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad(){
        this.WeaponTank=cc.find("Canvas/Lead/gravitation/TurretS/Weapon tank");
        this.Lead=cc.find("Canvas/Lead");
    },
    onCollisionEnter: function (other, self) {
        //如果碰到了角色
        if(other.node.group=="player"){
            if(G.turretNum>=8){
                self.node.destroy();
                return;
            }

            //得到我和核心的向量
            var xl=this.node.getPosition().sub(this.Lead.getPosition()).normalize();
            //得到角度
            var angle=Math.atan2(xl.y, xl.x)/ Math.PI * 180;
            //让引力环添加碎片
            this.WeaponTank.getComponent("Weapon tank").addFragment(angle);
            //自己消失
            self.node.destroy();
        }
    },
});
