
cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad(){
        this.WeaponTank=cc.find("Canvas/Lead/gravitation/TurretS/Weapon tank");
        this.Lead=cc.find("Canvas/Lead");

    },
    onCollisionEnter: function (other, self) {
        if(other.node.group=="player"){
            if(G.turretNum>=8){
                self.node.destroy();
                return;
            }

            // this.WeaponTank.getComponent("Weapon tank").FragmentNum+=1;

            var xl=this.node.getPosition().sub(this.Lead.getPosition()).normalize();
            var angle=Math.atan2(xl.y, xl.x)/ Math.PI * 180;

            this.WeaponTank.getComponent("Weapon tank").addFragment(angle);

            self.node.destroy();
        }
    },
});
