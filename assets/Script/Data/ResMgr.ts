import { _decorator, Button, Color, Component, director, error, find, instantiate, Label, Node, Prefab, resources, UITransform, Vec3 } from 'cc'; // 关键：导入 resources
import { DataConfig } from './DataConfig';
import { DataManager } from '../FrameWork/DataMgr';
import { ResManager } from '../FrameWork/ResManager';
const { ccclass, property } = _decorator;

@ccclass('ResMgr')
export class ResMgr extends Component {
    @property({type:Prefab})
    selectLevelUIPrefab:Prefab | null = null;

    private selectLevelInstance:Node | null = null;

    private flashNum: Label | null = null;
    private goldNum: Label | null = null;
    private berylNum: Label | null = null;
    private gameScene: any = null;
    private dataConfig: DataConfig;
    private tipTextNode: Node | null = null;
    private isExiting:boolean = false;

     protected async onLoad() {

        const startUINode = this.node.getChildByName('StartUI');
        if(!startUINode){
            return;
        }
        const lilFuncNode = startUINode.getChildByName('lilFunc');

        if (lilFuncNode) {
            this.flashNum = lilFuncNode.getChildByName('flashBtn').getComponentInChildren(Label);
            this.goldNum = lilFuncNode.getChildByName('goldBtn').getComponentInChildren(Label);
            this.berylNum = lilFuncNode.getChildByName('berylBtn').getComponentInChildren(Label);
        } else {
            console.error("未找到lilFunc节点");
        }
        this.initTipText();
        // await DataManager.Instance.loadAllData("Data");
        // await ResManager.Instance.loadAll();
    }

    start() {
        // 初始化数据配置
        this.dataConfig = DataConfig.getInstance();
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

        if(!this.selectLevelUIPrefab){
            this.showTipText("预制体未配置");
            console.error("SelectLevelUI预制体未在ResMgr中赋值");
            return;
        }
        
        const selectLevelNode = instantiate(this.selectLevelUIPrefab);
        const canvas = find('Canvas');
        if(canvas){
            selectLevelNode.parent = canvas;
            selectLevelNode.setPosition(Vec3.ZERO);
            selectLevelNode.setSiblingIndex(canvas.children.length);

        }else{
            this.showTipText("未找到Canvas节点");
            console.error("场景中无Canvas节点");
        }
        
    }

    // 改为异步方法，适配resources.load的异步逻辑
    async exitBtn() {
        // 1. 防抖：防止重复点击
        if (this.isExiting) return;
        this.isExiting = true;

        // 2. 检查 Canvas 节点
        const canvasNode = find("Canvas");
        if (!canvasNode) {
            error("未找到Canvas节点，无法返回主界面");
            this.showTipText("返回主界面失败：未找到UI容器");
            this.isExiting = false; // 重置防抖
            return;
        }

        // 3. 清理关卡选择UI实例（避免残留）
        if (this.selectLevelInstance) {
            this.selectLevelInstance.destroy();
            this.selectLevelInstance = null;
        }
        // 额外清理：遍历Canvas下的SelectLevelUI节点（防止未引用的残留）
        const selectLevelNode = canvasNode.getChildByName("SelectLevelUI");
        if (selectLevelNode) {
            selectLevelNode.destroy();
        }

        // 4. 检查是否已存在StartUI，避免重复创建
        const existingStartUI = canvasNode.getChildByName("StartUI");
        if (existingStartUI) {
            this.showTipText("已在主界面");
            this.isExiting = false; // 重置防抖
            return;
        }

        // 5. 修复：使用显式导入的resources加载预制体（核心修正）
        let startUIPrefab: Prefab | null = null;
        try {
            // 【关键】路径规则：
            // - 必须放在 项目根目录/resources/ 文件夹下（需手动创建）
            // - 路径是相对于resources的相对路径，且**区分大小写**
            // - 示例：若预制体路径是 resources/Prefabs/StartUI.prefab，则写 'Prefabs/StartUI'
            startUIPrefab = await new Promise<Prefab>((resolve, reject) => {
                resources.load('Prefabs/StartUI', Prefab, (err, prefab) => {
                    if (err) {
                        console.error("加载StartUI预制体失败：", err);
                        reject(err);
                        return;
                    }
                    resolve(prefab);
                });
            });
        } catch (err) {
            error("加载StartUI预制体异常：", err);
            this.showTipText("返回主界面失败：预制体加载失败");
            this.isExiting = false;
            return;
        }

        if (!startUIPrefab) {
            error("获取StartUI预制体失败！请检查：1.预制体是否在resources/Prefabs目录下 2.预制体名称是否为StartUI 3.路径是否拼写错误");
            this.showTipText("返回主界面失败：预制体未找到");
            this.isExiting = false; // 重置防抖
            return;
        }

        // 6. 实例化StartUI并设置属性
        const startUINode = instantiate(startUIPrefab);
        if (!startUINode) {
            error("实例化StartUI预制体失败！");
            this.showTipText("返回主界面失败：实例化异常");
            this.isExiting = false; // 重置防抖
            return;
        }

        // 设置父节点和层级
        startUINode.setParent(canvasNode);
        startUINode.setPosition(Vec3.ZERO);
        startUINode.setScale(Vec3.ONE);
        startUINode.setSiblingIndex(canvasNode.children.length); // 置于最上层

        // 7. 延迟销毁当前节点（避免销毁过快导致提示失效）
        this.scheduleOnce(() => {
            if (this.node && this.node.isValid) {
                this.node.destroy();
            }
        }, 0.1);

        // 8. 提示+重置防抖
        this.showTipText("成功返回主界面");
        this.scheduleOnce(() => {
            this.isExiting = false;
        }, 0.5);
    }
}