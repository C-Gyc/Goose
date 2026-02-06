import { _decorator, Component, director, Node } from 'cc';
import { UIManager } from './UIManager';
import { UIType } from './UIBase';
import { DataManager } from './DataMgr';
import { UIName } from './UIConfig';
import { ResManager } from './ResManager';
import { LevalData } from '../Data/DataClass';
import { DataConfig } from '../GameDatas/DataConfig';
const { ccclass, property } = _decorator;

@ccclass('AppStart')
export class AppStart extends Component {
    private _levalData:LevalData=null;
    protected onLoad(): void {
        UIManager.Instance.openUI(UIName.MainUI,UIType.Page);
        UIManager.Instance.openUI(UIName.SelectUI,UIType.PopWin);
        director.pause();
    }
        
        
    

    
}


