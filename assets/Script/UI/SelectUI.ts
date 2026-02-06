import { _decorator, Button, Canvas, Component, director, find, Layout, log, Node, sp, Vec3 } from 'cc';
import { PopWin, UIBase } from '../FrameWork/UIBase';
import { DataConfig } from '../GameDatas/DataConfig';
import { UIName, UIRoot } from '../FrameWork/UIConfig';
import { createNodeWithPrefab } from '../Tools/Tools';
import { ModulerMgr } from '../FrameWork/ModulerMgr';
import { ModulerName } from '../Tools/ModulerConfig';
import { RoleMgr } from '../Modules/RoleMgr';
import { ResManager } from '../FrameWork/ResManager';
import { Card } from '../GameObject/Card';
import { DataManager } from '../FrameWork/DataMgr';
const { ccclass, property } = _decorator;

@ccclass('SelectUI')
export class SelectUI extends PopWin {
    private _isOpened: boolean = false;
    private _icon: Node = null;
    private _select: Node = null;
    private _remainingNumbers:number[][]=[[]];
    onUse(): void {

        this._icon = find('Canvas/UIRoot/Page/MainUI/Icon');
        this._select = this.node.getChildByName("Select");
        if (!this._isOpened) {
            this.initi();
        }
        if (this._isOpened) {
            //角色刷新
            this.Refresh();
        }
        this._isOpened = true;
        
    }
    initi() {
        this._remainingNumbers = [[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5]];
        const efeifei: Node = createNodeWithPrefab("Efeifei", this._select);
        const lingguang: Node = createNodeWithPrefab("Lingguang", this._select);
        const tieguo: Node = createNodeWithPrefab("Tieguo", this._select);
        this._select.getComponent(Layout).updateLayout(true)
        this.onBtnsClicks();
    }
    setRolePos(index:number):Vec3{
        if(this._remainingNumbers[index-1].length===0){
            return null;
        }
        let randomIndex = Math.floor(this._remainingNumbers[index-1].length/2);
        randomIndex = this._remainingNumbers[index-1].splice(randomIndex,1)[0];
        return new Vec3(150*index,140*randomIndex,0);
    }
    tieguo() {
        const node: Node = createNodeWithPrefab("TieguoAvatar", this._icon)
        this.colseSelect();
        //创建角色
        ModulerMgr.Instance.getModuler(RoleMgr).createRole(this.setRolePos(3), 1005)

    }

    lingguang() {
        const node: Node = createNodeWithPrefab("LingguangAvatar", this._icon)
        this.colseSelect();
        ModulerMgr.Instance.getModuler(RoleMgr).createRole(this.setRolePos(1), 1003)
    }

    efeifei() {
        const node: Node = createNodeWithPrefab("EfeifeiAvatar", this._icon)
        this.colseSelect();
        ModulerMgr.Instance.getModuler(RoleMgr).createRole(this.setRolePos(2), 1002)
    }
    card(btn:Button) {
        this.colseSelect();
        //匹配数据
        const cardData = DataManager.Instance.getDataById(Number(btn.name));
    }

    colseSelect() {
        this._select.getComponent(Layout).updateLayout(true)
        this.closeUI(UIName.SelectUI);
        this._select.destroyAllChildren();
        director.resume();
    }
    Refresh() {
        enum role {
            "Efeifei",
            "Lingguang",
            "Tieguo"
        }

        director.pause();
        //this._selected=find("Canvas/UIRoot/PopWin/SelectUI/Select");
        this._select.destroyAllChildren();
        let cardPrefab = ResManager.Instance.getPrefab("Card");
        let randCount = Math.floor(Math.random() * 3);
        for (let index = 0; index <= randCount; index++) {
            let randIndext = Math.floor(Math.random() * 3);
            if (DataConfig.Instance.Type === "role") {
                createNodeWithPrefab(role[randIndext], this._select)
            }
            //角色刷新
            if (DataConfig.Instance.Type === "card") {
                //卡片强化刷新
                let cardNode = createNodeWithPrefab(cardPrefab, this._select);
                let id = 8000+Math.floor(Math.random()*20+1);
                cardNode.getComponent(Button).name = id.toString();
                cardNode.getComponent(Card).init(id);
            }
        }
        this._select.getComponent(Layout).updateLayout(true)
        this.onBtnsClicks();
    }

}


