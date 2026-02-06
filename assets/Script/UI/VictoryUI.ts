import { _decorator, Component, director, find, Label, Node } from 'cc';
import { PopWin } from '../FrameWork/UIBase';
import { DataConfig } from '../GameDatas/DataConfig';
import { UIName } from '../FrameWork/UIConfig';
import { ModulerMgr } from '../FrameWork/ModulerMgr';
const { ccclass, property } = _decorator;

@ccclass('VictoryUI')
export class VictoryUI extends PopWin {
    private _killLable:Label  = null;
    onStart(...args: any[]): void {
        this._killLable = this.node.getChildByName('KillCount').getComponent(Label);
        this._killLable.string = DataConfig.Instance.KilledCount.toString();
    }
    confirm(){
        ModulerMgr.Instance.clear();
        this.hide(true);
        this.closeUI(UIName.MainUI,true);
        this.closeUI(UIName.SelectUI,true);
        find("Canvas/UIRoot").destroy();
        find("Canvas/GameRoot").destroy();
        director.resume();
    }

}


