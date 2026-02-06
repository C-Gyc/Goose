import { _decorator, Color, Component, director, error, find, Label, Node, PageView, Prefab, UITransform, Vec3} from 'cc';
import { ResMgr } from './ResMgr'; // 导入ResMgr
import { DataConfig } from '../GameDatas/DataConfig';
import { createNodeWithPrefab } from '../Tools/Tools';
const { ccclass, property } = _decorator;

@ccclass('SelectLevelUIScript')
export class SelectLevelUIScript extends Component {
     private flashNum: Label | null = null;
   private goldNum: Label | null = null;
   private berylNum: Label | null = null;
   private dataConfig:DataConfig
   private tipTextNode: Node | null = null;
   private _pageView:PageView = null;
   protected onLoad(): void {
    
       this.flashNum = this.node.getChildByName('flashBtn').getComponentInChildren(Label);
       this.goldNum = this.node.getChildByName('goldBtn').getComponentInChildren(Label);
       this.berylNum = this.node.getChildByName('berylBtn').getComponentInChildren(Label);
       this._pageView = this.node.getComponentInChildren(PageView);
       this.initTipText();
   }
   start() {
       //先获取DataConfig实例
       this.dataConfig = DataConfig.Instance;
       //给DataConfig的Flash赋值
       this.dataConfig.Flash = 30;
       

       this.dataConfig.Gold = 0;
       

       this.dataConfig.Beryl = 0;
       
       this.updateAllUI();
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
       const uiTransform = this.tipTextNode.getComponent(UITransform);
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
    // 找到全局的ResMgr实例（从Canvas节点获取）
    private getGlobalResMgr(): ResMgr | null {
        const canvas = this.node.scene.getChildByName('Canvas');
        if (canvas) {
            return canvas.getComponent(ResMgr);
        }
        console.error("未找到全局ResMgr实例");
        return null;
    }

    // exitBtn点击后，调用ResMgr的exitBtn方法
    public onExitBtnClick() {
        const resMgr = this.getGlobalResMgr();
        if (resMgr) {
            resMgr.exitBtn(); // 调用ResMgr的exitBtn逻辑
        }
    }

    startBtn(){
        const canvas = find("Canvas");
       if(this.dataConfig.Flash < 5){
           this.showTipText("体力不够！");
           return;
       }
       this.dataConfig.Flash -= 5;
       this.updateAllUI();
       const lv = this._pageView.getCurrentPageIndex();
       this.dataConfig.LV = lv;
       
       createNodeWithPrefab('GameRoot',canvas);
       createNodeWithPrefab('UIRoot',canvas);
   }
}