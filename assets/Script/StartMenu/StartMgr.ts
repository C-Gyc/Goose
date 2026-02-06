import { _decorator, Component, ProgressBar, SceneAsset, director, resources, Asset } from 'cc';
import { DataManager } from '../FrameWork/DataMgr';
import { ResManager } from '../FrameWork/ResManager';
const { ccclass, property } = _decorator;


@ccclass('StartMgr')
export class StartMgr extends Component {
    // 进度条组件（拖入你的进度条）
    @property(ProgressBar)
    progressBar: ProgressBar = null!;

    // 目标跳转场景（拖入GameScene）
    @property({ type: SceneAsset })
    targetScene: SceneAsset = null!;

    // 需要预加载的resources资源路径（直接填路径，不用选类型）
    // @property({ type: [string], tooltip: "resources下的资源路径（如：images/icon）" })
    // preloadResPaths: string[] = [];


    private totalTask = 0;
    private finishTask = 0;
    private currentProgress = 0;
    private isJump = false;


    async start() {
        // 计算总任务数：资源数 + 场景数
        //this.totalTask = this.preloadResPaths.length + (this.targetScene ? 1 : 0);
        
        // 初始化进度条
        this.progressBar.progress = 0;

        // 开始加载资源+场景
        //this.preloadRes();
        //if (this.targetScene) this.preloadScene();
       await ResManager.Instance.loadAll((percent)=>{
        this.progressBar.progress= percent;});
        await DataManager.Instance.loadAllData("Data");
        director.loadScene("GameScene")
        
    }


    // update(dt: number) {
    //     if (this.isJump) return;

    //     // 计算真实进度
    //     const realProgress = this.finishTask / this.totalTask;

    //     // 进度条平滑动画
    //     if (this.currentProgress < realProgress) {
    //         this.currentProgress += dt * 0.5;
    //         this.currentProgress = Math.min(this.currentProgress, realProgress);
    //         this.progressBar.progress = this.currentProgress;
    //     }

    //     // 进度满了跳转场景
    //     if (this.currentProgress >= 1 && !this.isJump) {
    //         this.isJump = true;
    //         director.loadScene(this.targetScene.scene.name);
    //     }
    // }


    // // 预加载resources资源
    // private preloadRes() {
    //     if (this.preloadResPaths.length === 0) {
    //         this.finishTask++;
    //         return;
    //     }

    //     this.preloadResPaths.forEach(path => {
    //         resources.load(path, Asset, (err) => {
    //             if (err) console.error(`资源加载失败：${path}`);
    //             this.finishTask++;
    //         });
    //     });
    // }


    // // 预加载目标场景
    // private preloadScene() {
    //     director.preloadScene(this.targetScene.scene.name, (err) => {
    //         if (err) console.error(`场景加载失败`);
    //         this.finishTask++;
    //     });
    // }
}