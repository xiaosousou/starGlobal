window.G={
    player:null,//主角
    main:null,//主函數
    gamestart:false,//游戲開始
    startenemy:false,//开始添加敌人
    score:0,//分數
    wave:0,//關卡數

    MaxTurret:false,//武器已经满了

    //保存buff 吃到什麽 就保存
    split:false,//分裂彈


    shieldNum:0,//護盾数量
    turretNum:0,//炮塔数量
    //FragmentSpeed:1,//碎片出现速度
    //Infinite:false,//炮台是否无限

}


cc.Class({
    extends: cc.Component,

    properties: {
        Lead:cc.Node,//主角
        TurretS:cc.Node,//所有炮台的父类(控制炮塔旋轉)
        SwopeToPlay:cc.Node,//開始圖標

        SpaceCore:cc.Animation,//標題動畫
        Gravitation:cc.Animation,//主角引力圈 動畫
        ShareS:[cc.Animation],//分享鏈接 3個圖標動畫
        
        Wave:cc.Animation,//游戲下面的UI(關卡進度條) 
        GameTopUI:cc.Animation,//游戲上面的UI
        BloodInit:cc.Animation,//血条初始化 动画

        EnemyPrefabs:[cc.Prefab],//敵人的預製資源
        BossPrefab:[cc.Prefab],//Boss预制资源
        Fragmentfab:cc.Prefab,//武器碎片的预制资源

        PropPrefabS:[cc.Prefab],//被动技能掉落预制资源
        GunPrefabS:[cc.Prefab],//武器道具
    },

    // use this for initialization
    onLoad: function () {
        cc.sys.localStorage.clear();

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;//碰撞开启

        G.main=this;
        G.gamestart=false;//游戏是否结束
        G.startenemy=false;//是否开始添加敌人了

        G.score=0;//分数
        G.wave=0;//關卡為哦
        G.shieldNum=0;//護盾為0個
        G.turretNum=0;//炮塔数量为0



        this.enemynode=cc.find("Canvas/enemys");//敌人节点
        this.Hikeenemynode=cc.find("Canvas/Hikeenemy");//我的小飞机的节点
        this.bossnode=cc.find("Canvas/boss");//boss节点
        this.fragmentnode=cc.find("Canvas/Fragment");//碎片节点
        this.bulletnode=cc.find("Canvas/bullet");//子弹节点
        this.Propnode=cc.find("Canvas/Prop");//技能节点
        this.StartUI=cc.find("Canvas/StartUI");//開始界面
        this.GameUI=cc.find("Canvas/GameUI");//游戲界面
        this.GameOverUI=cc.find("Canvas/Gameover");//游戏结束

        this.WaveLabel=cc.find("Canvas/GameUI/Wave/WAVELabel").getComponent(cc.Label);//关卡数量显示
        this.WaveProgress=cc.find("Canvas/GameUI/Wave/WAVE Progress");//关卡进度显示
        this.NextWavenode=cc.find("Canvas/NextWave");//下一关动画

        this.TouchStartState=false;//是否點擊開始了
        this.timer=0;//添加敌人计时
        this.timer1=0;//添加武器碎片计时
        this.lastClick=0;//雙擊間隔計時

        this.touchspeed=1.25;//手指移动 和 主角移动的比值
        this.totalEnemyNum=0;//当前关卡总共出现的敌人
        this.WaveEnemyNum=0;//当前关卡敌人生成数量

        //通過判斷拖動距離 控制是否開始游戲
        this.startmoveX=0;//手指拖動的距離
        this.startmoveY=0;
        //通過判斷點擊的次數 和間隔判斷是不是雙擊
        this.doubleTouchNum=0;
        this.doubleTouchStart=false;

        var self=this;
        self.node.on(cc.Node.EventType.TOUCH_START, self.touchStart, self);
        self.node.on(cc.Node.EventType.TOUCH_MOVE, self.touchMove, self);
        self.node.on(cc.Node.EventType.TOUCH_END, self.touchEnd, self);

        
        //主角引力圈播放完成 回調 （引力圈動畫 控制敵人的生成）
        self.Gravitation.on('finished',  self.GravitationonFinished,    self);
    },
    touchStart:function(){
        //双击判断
        this.pauseresume();
    },
    touchMove:function(event){
        //如果游戲未開始 并且也沒有拖動開始
        if(G.gamestart==false&&this.TouchStartState==false){
            //拖動了核心
            if(Math.abs(this.startmoveX)>50||Math.abs(this.startmoveY)>50){
                //播放 標題、引力圈、下面3個分享按鈕的動畫
                this.SpaceCore.play();
                this.Gravitation.play();
                this.SwopeToPlay.active=false;
                for(var i in this.ShareS){
                    this.ShareS[i].play();
                }

                //顯示游戲UI
                this.GameUI.active=true;
                //播放上方、下方動畫
                this.Wave.play();
                this.GameTopUI.play();

                this.TouchStartState=true;//已經點擊開始了
                G.gamestart=true;
                return;
            }
            this.startmoveX+=event.getDelta().x;
            this.startmoveY+=event.getDelta().y;
            return;
        }

        
        if(G.gamestart==false){
            return;
        }

        if(this.Lead.x+event.getDelta().x*this.touchspeed>(this.node.width/2)-(this.Lead.width/2)){
            this.Lead.x=(this.node.width/2)-(this.Lead.width/2);
        }else if(this.Lead.x+event.getDelta().x*this.touchspeed<(-this.node.width/2)+(this.Lead.width/2)){
            this.Lead.x=(-this.node.width/2)+(this.Lead.width/2);
        }else{
            this.Lead.x+=event.getDelta().x*this.touchspeed;
        }

        if(this.Lead.y+event.getDelta().y*this.touchspeed>(this.node.height/2)-(this.Lead.height/2)){
            this.Lead.y=(this.node.height/2)-(this.Lead.height/2);
        }else if(this.Lead.y+event.getDelta().y*this.touchspeed<(-this.node.height/2)+(this.Lead.height/2)){
            this.Lead.y=(-this.node.height/2)+(this.Lead.height/2);
        }else{
            this.Lead.y+=event.getDelta().y*this.touchspeed;
        }

    },
    touchEnd:function(){
        this.startmoveX=0;//手指拖動的距離
        this.startmoveY=0;
        
    },
    //判断是否双击
    pauseresume () {
        var now = Date.now();
        // Double click in 300 ms
        if (now - this.lastClick < 200) {
            cc.log("双击");
            var push=cc.instantiate(this.Lead.getChildByName("Push"));
            push.parent=this.Lead;
            push.active=true;
            var action = cc.sequence(cc.scaleTo(0.5,20), cc.callFunc(function() {
                push.active=false;
                push.destroy();
            }, this));
            push.runAction(action);
        }
        // Click
        else {
            cc.log("单击");
        }
        this.lastClick = now;
    },
    //主角引力圈播放完成
    GravitationonFinished:function(){
        this.StartUI.active=false;
        this.TurretS.getComponent("TurretS").ShowTurret();
        this.NextWave();

        //G.startenemy=true;

        //this.addFragment();//每一关开始 出现2-5个碎片
        //this.addGun();
    },



    //添加敌人
    addenemy:function(){
        var item=cc.instantiate(this.EnemyPrefabs[Math.floor(Math.random()*this.EnemyPrefabs.length)]);
        //var item=cc.instantiate(this.EnemyPrefabs[0]);
        var posY=(Math.random() - 0.5) * 2 * (this.node.height/2 + 120);
        if(Math.abs(posY)<960){
            var posX=Math.random()>0.5?-this.node.width/2 - 40 :this.node.width/2 + 40;
        }else{
            var posX=(Math.random() - 0.5) * 2 * this.node.width/2;
        }

        item.setPosition(cc.v2(posX,posY));
        item.parent=this.enemynode;
    },
    //添加boss
    addboss:function(){
        var item=cc.instantiate(this.BossPrefab[0]);
        item.parent=this.bossnode;
        
    },
    //添加武器碎片
    addFragment:function(){
        // for(var i=0;i<3+Math.random()*3;i++){
        //     var item=cc.instantiate(this.Fragmentfab);
        //     item.parent=this.fragmentnode;
        //     item.setPosition(cc.v2((Math.random() - 0.5) * 2 * (this.node.width/2-200) ,(Math.random() - 0.5) * 2 * (this.node.height/2-200)));
        // }
    },
    //掉落血
    addBlood:function(Prefab){
        var item=cc.instantiate(Prefab);
        item.parent=this.Propnode.children[1];
        item.setPosition(cc.v2((Math.random() - 0.5) * 2 * (this.node.width/2-200) ,(Math.random() - 0.5) * 2 * (this.node.height/2-300)));
    },
    //掉落武器
    addGun:function(){
        for(var i in this.GunPrefabS){
            var item=cc.instantiate(this.GunPrefabS[i]);
            item.parent=this.Propnode.children[0];
            item.setPosition(cc.v2( i*100,0));
        }
        
    },
    //Boss死亡 回调
    BossDie:function(){
        this.addBlood(this.PropPrefabS[1]);//掉大血
        //this.addGun();//掉武器
    },
    //下一关
    NextWave:function(){
        //每过一关 1/3 概率 掉落小血
        if(Math.random()<=1/3) this.addBlood(this.PropPrefabS[0]);
        //this.addBlood(this.PropPrefabS[0])

        G.startenemy=false;//暂停游戏
        G.wave++;//关卡增加
        this.totalEnemyNum=G.wave*10;//当前关卡应该出现的敌人数量

        this.WaveLabel.string=G.wave;//设置显示关卡数字
        this.bulletnode.removeAllChildren();//清除子弹节点
        this.enemynode.removeAllChildren();//清除敌人节点
        this.Hikeenemynode.removeAllChildren();//清除我的小飞机节点

        if(G.wave%5==0){
            //0是boss关
            this.NextWavenode.getComponent(cc.Label).string="第"+G.wave+"关 Boss关";
        }else{
            this.NextWavenode.getComponent(cc.Label).string="第"+G.wave+"关";
        }
        

        //如果是第一小关 其他的节点都为关闭
        if(G.wave%5==1){
            for(var i=2;i<=5;i++){
                this.WaveProgress.children[i].children[0].active=false;
            }
        }else if(G.wave%5==0){
            //0是boss关
            this.WaveProgress.children[5].children[0].active=true;

        }else{
            //设置关卡进度的显示
            this.WaveProgress.children[G.wave%5].children[0].active=true;
        }


        //下一关的 提升显示
        this.NextWavenode.active=true;

        // 创建一个移动动作 显示提示
        var action = cc.sequence(cc.fadeOut(3.0), cc.callFunc(function() {
            this.NextWavenode.active=false;
            this.NextWavenode.opacity=255;
            //下一关 初始化
            G.startenemy=true;
            //this.WaveEnemyNum=0;//出现敌人数
            //this.addFragment();//每一关开始 出现2-5个碎片
            //this.addGun();
            if(G.wave%5==0){
                //0是boss关
                this.addboss();
    
            }
            

        }, this));

        // 执行动作
        this.NextWavenode.runAction(action);


    },
    update: function (dt) {
        if(G.gamestart==false){
            return;
        }

        if(G.startenemy==true){
            //添加敌人
            this.timer+=dt;
            if(this.timer>=0.7){
                this.timer=0;
                this.totalEnemyNum--;//当前应该出现的敌人数 减1

                if(this.totalEnemyNum<=0){
                    if(this.enemynode.childrenCount==0&&this.bossnode.childrenCount==0){
                        this.NextWave();
                    }
                    return;
                }
                this.addenemy();
                
            }
        }

    },
    gameover1:function(){
        this.GameOverUI.active=true;
    },

    restartgame:function(){
        cc.director.loadScene("helloworld");
    }, 
});
