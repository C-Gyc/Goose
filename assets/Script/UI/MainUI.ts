import { _decorator, Component, director, find, Label, Layout, Node } from 'cc';
import { UIBase, UIType } from '../FrameWork/UIBase';
import { UIName, UIRoot } from '../FrameWork/UIConfig';
import { DataConfig } from '../GameDatas/DataConfig';
const { ccclass, property } = _decorator;

@ccclass('MainUI')
export class MainUI extends UIBase {
    private _selected:Node=null;
    private _timeLable:Label =null;
    private _totalSeconds:number = 0;
    private _coinLable:Label =null;
    private _killLable:Label =null;
    private _percentLable:Label =null;
    protected onLoad(): void {
         DataConfig.Instance.Percent = 0;
         DataConfig.Instance.CoinCount = 0;
         DataConfig.Instance.KilledCount= 0;
        this._timeLable = this.node.getChildByName('Time').getComponent(Label);
        this._coinLable =  this.node.getChildByName('CoinCount').getComponent(Label);
        this._killLable =  this.node.getChildByName('KilledCount').getComponent(Label);
        this._percentLable =  this.node.getChildByName('Percent').getComponent(Label);
        this.updateTimerLable();
    }
    protected start(): void {
        this.schedule(()=>{
            this._totalSeconds++;
            this.updateTimerLable();
        },1);
    }

    updateTimerLable(){
        const minuters =Math.floor(this._totalSeconds/60);
        const seconds = this._totalSeconds%60;
        const timeStr = `${this.padZero(minuters)}:${this.padZero(seconds)}`;
        this._timeLable.string= timeStr;
    }
    stopTime(){
        this.unschedule(this.updateTimerLable());
    }
    padZero(num:number):string{
        return num<10?`0${num}`:`${num}`;
    }
    pauseBtn(){ 
        this.openUI(UIName.PauseUI,UIType.PopWin);
        director.pause();
    }
    gooseEgg(){
        DataConfig.Instance.Type="role"
        this.openUI(UIName.SelectUI,UIType.PopWin);
    }
    treasureChest(){
        DataConfig.Instance.Type="card"
        this.openUI(UIName.SelectUI,UIType.PopWin);
        //强化刷新
    }
    protected update(dt: number): void {
        this._killLable.string = DataConfig.Instance.KilledCount.toString();
        this._coinLable.string = DataConfig.Instance.CoinCount.toString()
        this._percentLable.string = DataConfig.Instance.Percent.toString()+"%";
        if(DataConfig.Instance.Percent>=100){
            director.pause();
            this.openUI(UIName.VictoryUI,UIType.PopWin);
        }
    }

    
}


