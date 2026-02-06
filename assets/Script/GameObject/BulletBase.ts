import { _decorator, Component, Node, Vec3 } from 'cc';
import { BulletData, RoleData } from '../Data/DataClass';
import { DataManager } from '../FrameWork/DataMgr';
import { ModulerMgr } from '../FrameWork/ModulerMgr';
import { MonsterCtrl } from '../Modules/MonsterCtrl';
const { ccclass, property } = _decorator;

@ccclass('BulletBase')
export class BulletBase extends Component {
    public _role: RoleData = null;
    public _bullet: BulletData = null;
    private _isInit: boolean = false;
    private _monNode :Node = null;
    protected onLoad(): void {
       
    }
    start() {
        this.onStart();
    }
    init(id: number,monsNode:Node) {
        this._monNode=monsNode;
        this._isInit = true;
        this._bullet = DataManager.Instance.getDataById(id);
        this._role = DataManager.Instance.getDataById(this._bullet.roleid);
    }
    onStart(): void {

    }
    bulletMove(dt: number,monsterNode:Node) {
        

    }
    update(deltaTime: number) { 
        if (this._isInit) {
            this.bulletMove(deltaTime,this._monNode);
        }
    }
}


