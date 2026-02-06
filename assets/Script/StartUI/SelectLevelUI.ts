import { _decorator, Color, Component, director, error, find, instantiate, Label, Node, Prefab, UITransform, Vec3 } from 'cc';
import { DataConfig } from './DataConfig';
import { ResManager } from './ResManager';
const { ccclass, property } = _decorator;

@ccclass('SelectLevelUI')
export class SelectLevelUI extends Component {
    private flashNum: Label | null = null;
    private goldNum: Label | null = null;
    private berylNum: Label | null = null;
    private gameScene: any = null;
    private dataConfig: DataConfig;
    private tipTextNode: Node | null = null;
    private startUI: Prefab | null = null;

    protected onLoad(): void {
        this.flashNum = this.node.getChildByName('flashBtn').getComponentInChildren(Label);
        this.goldNum = this.node.getChildByName('goldBtn').getComponentInChildren(Label);
        this.berylNum = this.node.getChildByName('berylBtn').getComponentInChildren(Label);
        this.initTipText();
    }
    async start() {
        

        //先获取DataConfig实例
        this.dataConfig = DataConfig.getInstance();
        //给DataConfig的Flash赋值
        this.dataConfig.Flash = 30;
        

        this.dataConfig.Gold = 0;
        

        this.dataConfig.Beryl = 0;
        
        this.updateAllUI();
        await ResManager.Instance.loadAll();
    }

    private initTipText(){
        const canvas = find('Canvas');
        if(!canvas){
            console.error("场景中没有Canvas节点");
            return;
        }

        //创建文字节点（只创建一次）
        this.tipTextNode = new Node('TipText');
        this.tipTextNode.parent = canvas;

        //添加Label组件，设置样式
        const tipLabel = this.tipTextNode.addComponent(Label);
        tipLabel.string = "";
        tipLabel.color = new Color(255, 0, 0);
        tipLabel.horizontalAlign = Label.HorizontalAlign.CENTER;

        //设置位置
        const uiTransform = this.tipTextNode.addComponent(UITransform);
        uiTransform.setContentSize(400, 50);
        this.tipTextNode.setPosition(new Vec3(0, 250, 0));

        this.tipTextNode.active = false;
    }

    private showTipText(text: string, duration: number = 2){
        if(!this.tipTextNode)return;

        const tipLabel = this.tipTextNode.getComponent(Label);
        if(tipLabel){
            tipLabel.string = text;
            this.tipTextNode.active = true;

            this.scheduleOnce(() => {
                this.tipTextNode!.active = false;
            }, duration);
        }
    }

    private updateAllUI(){
        //正确赋值给Label的string
        if(this.flashNum){
            this.flashNum.string = this.dataConfig.Flash.toString() + "/30";
        }
        if(this.goldNum){
            this.goldNum.string = this.dataConfig.Gold.toString();
        }
        if(this.berylNum){
            this.berylNum.string = this.dataConfig.Beryl.toString();
        }
    }

    startBtn(){
        if(this.dataConfig.Flash < 5){
            this.showTipText("体力不够！");
            return;
        }
        this.dataConfig.Flash -= 5;
        this.updateAllUI();
        director.loadScene('PlayScene');
    }

    exitBtn(){
        //Canvas作为UI父节点
        const canvasNode = find("Canvas");
        if(!canvasNode){
            error("未找到Canvas节点");
            return;
        }
        const startUI = ResManager.Instance.getPrefab('StartUI');
        const startUINode = instantiate(startUI);
        if(startUINode){
            startUINode.setParent(canvasNode);
            //重置位置和大小
            startUINode.setPosition(0, 0, 0);
        }
        if(this.node){
            //this.node.active = false;
            this.node.destroy();
        }
    }
}


