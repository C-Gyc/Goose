import { _decorator, Component, error, find, instantiate, Label, Node, ProgressBar, sp, Sprite } from 'cc';
import { EventCenter } from './EventCenter';
import { ResManager } from './ResManager';
import { DataConfig } from './DataConfig';
const { ccclass, property } = _decorator;

@ccclass('HeroThingsUI')
export class HeroThingsUI extends Component {
    private goldNum: Label | null = null;
    private berylNum: Label | null = null;
    private atkNum: Label | null = null;
    private atk_sNum: Label | null = null;
    private hpNum: Label | null = null;
    private showHeroNode: Node | null = null;
    private nameLabel: Label | null = null;
    private goldUpNum: Label | null = null;
    private levelLabel: Label | null = null;
    private gradeProgressBar: ProgressBar | null = null;

    //接受从HeroUI传递的参数
    public heroName: string = '';
    public heroPrefabName: string = '';
    public hp: number = 0;
    public atk: number = 0;
    public level: number = 1;
    public roleId: number = 0;
    public upNeedGold: number = 300;

    dataConfig: DataConfig;
    
    protected onLoad(): void {
        this.goldNum = this.node.getChildByName('goldBtn').getComponentInChildren(Label);
        this.berylNum = this.node.getChildByName('berylBtn').getComponentInChildren(Label);
        this.atkNum = this.node.getChildByName('ATK').getComponentInChildren(Label);
        this.atk_sNum = this.node.getChildByName('ATK_S').getComponentInChildren(Label);
        this.hpNum = this.node.getChildByName('HP').getComponentInChildren(Label);
        this.showHeroNode = this.node.getChildByName('ShowHero');
        this.nameLabel = this.node.getChildByName('Namebg').getComponentInChildren(Label);
        this.goldUpNum = this.node.getChildByName('Upgrade').getChildByName('consumeBg').getComponentInChildren(Label);
        this.levelLabel = this.node.getChildByName('Upgrade').getComponentInChildren(Label); 
        this.gradeProgressBar = this.node.getChildByName('Upgrade').getComponentInChildren(ProgressBar);
        console.log(this.gradeProgressBar);
        
    }
    async start() {
        //先获取DataConfig实例
        this.dataConfig = DataConfig.getInstance();
        await ResManager.Instance.loadAll();
        await this.showHeroSkeleton();

        this.level = this.dataConfig.getLevelByName(this.roleId);
        this.updateAllUI();
    }

    protected update(dt: number): void {
        this.updateAllUI();
    }

    private async showHeroSkeleton(){
        if(!this.heroPrefabName || !this.showHeroNode){
            error("英雄预制体名称为空或ShowHero节点不存在");
            return;
        }

        const heroPrefab = ResManager.Instance.getPrefab(this.heroPrefabName);
        if(!heroPrefab){
            error("未找到英雄预制体", this.heroPrefabName);
            return;
        }

        const heroNode = instantiate(heroPrefab);
        heroNode.setParent(this.showHeroNode);
        heroNode.setPosition(0, 0, 0);
        //heroNode.setScale(1, 1, 1);

        const skeleton = heroNode.getComponent(sp.Skeleton);
        if(!skeleton){
            error("英雄预制体中未找到Skeleton组件");
            return;
        }

        skeleton.setAnimation(0, 'idle', true);
        if(this.nameLabel){
            this.nameLabel.string = this.heroName;
        }
    }

    private updateAllUI() {
        //正确赋值给Label的string
        if (this.goldNum) {
            this.goldNum.string = this.dataConfig.Gold.toString();
            this.goldUpNum.string = `${this.dataConfig.Gold} / ${this.upNeedGold}`;
        }
        if (this.berylNum) {
            this.berylNum.string = this.dataConfig.Beryl.toString();
        }
        if(this.atkNum && this.atk_sNum){
            this.atkNum.string = this.atk.toString();
            this.atk_sNum.string = this.atk.toString();
        }
        if(this.hpNum){
            this.hpNum.string = this.hp.toString();
        }
        if(this.levelLabel){
            this.levelLabel.string = `${this.level} / 10`;
        }
        if(this.gradeProgressBar){
            this.gradeProgressBar.progress = this.level / 10;
        }
    }

    gradeBtn(){
        if(this.dataConfig.Gold < this.upNeedGold){
            return;
        }
        if(this.level >= 10) { return; }

        this.dataConfig.Gold -= this.upNeedGold;
        this.level++;
        this.hp += 150;
        this.atk += 100;
        this.dataConfig.updateRoleLevel(this.roleId, this.level, this.hp, this.atk);
        this.upNeedGold = Math.floor(this.upNeedGold * 1.5);
        this.updateAllUI();
    }

    exitBtn() {
        //Canvas作为UI父节点
        const canvasNode = find("Canvas");
        if (!canvasNode) {
            error("未找到Canvas节点");
            return;
        }
        const HeroUI = ResManager.Instance.getPrefab('HeroUI');
        const HeroUINode = instantiate(HeroUI);
        if (HeroUINode) {
            HeroUINode.setParent(canvasNode);
            //重置位置和大小
            HeroUINode.setPosition(0, 0, 0);
            HeroUINode.setScale(1, 1, 1);
        }
        if (this.node) {
            //this.node.active = false;
            this.node.destroy();
        }
    }
}


