import { _decorator, Component, find, instantiate, Node, Prefab } from 'cc';
import { SettingManager } from './SettingMgr';
const { ccclass, property } = _decorator;

@ccclass('StartUIMgr')
export class StartUIMgr extends Component {
    // 关联HeroUI预制体
    @property(Prefab)
    heroUIPrefab:Prefab = null;

    // 关联settingUI预制体
    @property(Prefab)
    settingUIPrefab:Prefab = null;

    // 英雄按钮的点击事件回调
    onClickHeroBtn(){
        // 1.隐藏当前StartUI
        this.node.active = false;

        // 2.实例化HeroUI预制体
        if(this.heroUIPrefab){
            const heroUI = instantiate(this.heroUIPrefab);
            const canvas = find('Canvas');
            if(canvas){
                heroUI.parent = canvas;
            }else{
                console.error('未找到Canvas节点');
                
            }
        }else{
            console.error('未绑定HeroUI预制体');
        }
    }

    // 打开设置UI
    onClickSettingBtn(){
        if(this.settingUIPrefab){
            const settingUI = instantiate(this.settingUIPrefab);
            const canvas = find('Canvas');
            if(canvas){
                settingUI.parent = canvas;
                const settingMgr = settingUI.getComponent(SettingManager);
                if(settingMgr) settingMgr.showSettingUI();
            }
        }
    }

}


