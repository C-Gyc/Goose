import { _decorator, Button, Component, error, EventTouch, find, instantiate, Label, Node, Prefab, sp } from 'cc';
import { DataConfig } from './DataConfig';
import { ResManager } from './ResManager';
import { HeroThingsUI } from './HeroThingsUI';
const { ccclass, property } = _decorator;

@ccclass('HeroUI')
export class HeroUI extends Component {
    private flashNum: Label | null = null;
    private goldNum: Label | null = null;
    private berylNum: Label | null = null;
    private gameScene: any = null;
    private dataConfig: DataConfig;

    protected onLoad(): void {
        this.flashNum = this.node.getChildByName('flashBtn').getComponentInChildren(Label);
        this.goldNum = this.node.getChildByName('goldBtn').getComponentInChildren(Label);
        this.berylNum = this.node.getChildByName('berylBtn').getComponentInChildren(Label);
    }
    async start() {
        //先获取DataConfig实例
        this.dataConfig = DataConfig.getInstance();

        this.updateAllUI();

        await ResManager.Instance.loadAll();
    }

    private updateAllUI() {
        //正确赋值给Label的string
        if (this.flashNum) {
            this.flashNum.string = this.dataConfig.Flash.toString() + "/30";
        }
        if (this.goldNum) {
            this.goldNum.string = this.dataConfig.Gold.toString();
        }
        if (this.berylNum) {
            this.berylNum.string = this.dataConfig.Beryl.toString();
        }
    }

    exitBtn() {
        //Canvas作为UI父节点
        const canvasNode = find("Canvas");
        if (!canvasNode) {
            error("未找到Canvas节点");
            return;
        }
        const startUI = ResManager.Instance.getPrefab('StartUI');
        const startUINode = instantiate(startUI);
        if (startUINode) {
            startUINode.setParent(canvasNode);
            //重置位置和大小
            startUINode.setPosition(0, 0, 0);
            startUINode.setScale(1, 1, 1);
        }
        if (this.node) {
            //this.node.active = false;
            this.node.destroy();
        }
    }

    heroThingsBtn(btn: Button){
        const canvasNode = find("Canvas");
        if (!canvasNode) {
            error("未找到Canvas节点");
            return;
        }

        //获取英雄数据
        const roleId = Number(btn.target.name);
        const dataConfig = DataConfig.getInstance();
        const prefabName = dataConfig.getPrefabByName(roleId);
        const hp = dataConfig.getHpByName(roleId);
        const atk = dataConfig.getAtkByName(roleId);
        const level = dataConfig.getLevelByName(roleId);

        const heroThingsUI = ResManager.Instance.getPrefab('HeroThingsUI');
        if(!heroThingsUI){
            error("未找到对应预制体，检查资源是否加载");
            return;
        }
        const thingsUINode = instantiate(heroThingsUI);
        if(thingsUINode){
            thingsUINode.setParent(canvasNode);
            thingsUINode.setPosition(0, 0, 0);
            thingsUINode.setScale(1, 1, 1);
        }

        const heroThingsComp = thingsUINode.getComponent('HeroThingsUI') as HeroThingsUI;
        if(heroThingsComp){
            heroThingsComp.heroName = dataConfig.getRoleDataById(roleId)?.roleName || prefabName;
            heroThingsComp.heroPrefabName = prefabName;
            heroThingsComp.hp = hp;
            heroThingsComp.atk = atk;
            heroThingsComp.level = level;
            heroThingsComp.roleId = roleId;
        }
        this.node?.destroy();
    }

}


