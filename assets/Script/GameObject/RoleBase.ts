import { _decorator, Component, log, Node, Skeleton, sp } from 'cc';
import { BulletMgr } from '../Modules/BulletMgr';
import { BulletData, RoleData } from '../Data/DataClass';
import { ModulerMgr } from '../FrameWork/ModulerMgr';
import { DataManager } from '../FrameWork/DataMgr';
import { MonsterCtrl } from '../Modules/MonsterCtrl';
const { ccclass, property } = _decorator;

export enum AniType {
    atk = 'atk',
    die = 'die',
    hit = 'hit',
    idle = 'idle',
    walk = 'walk',
    none = 'none',
}

@ccclass('RoleBase')
export class RoleBase extends Component {
    public roleid = null;
    private _skeleton: sp.Skeleton = null;
    private _role: RoleData = null;
    private _bullet: BulletData = null;
    private _curAni: string = null;
    private _monsterCtrl:MonsterCtrl=null;
    protected onLoad(): void {
        this._skeleton = this.node.getComponent(sp.Skeleton);
        this._monsterCtrl = ModulerMgr.Instance.getModuler(MonsterCtrl);
        // 注册监听事件
        // 注册监听事件
        this._skeleton.setStartListener(() => {

        })
        this._skeleton.setEndListener(() => {
            this._curAni = this._skeleton.animation;
            switch (this._curAni) {
                case 'atk':
                    this.creatBullet();
                    break;
                case 'die':
                    break;
                case 'hit':
                    break;
                case 'idle':
                    break;
                case 'walk':
                    break;
                default:
                    break;
            }
        })
        this._skeleton.setEventListener(() => {
        })
    }
    init(id: number) {
        this._role = DataManager.Instance.getDataById(id);
        this._bullet = DataManager.Instance.getDataById(this._role.bulletid);
        this.playAni();
        // 如果怪出现，在条件允许的情况下发射子弹
        this.schedule(this.atk, this._role.interval);
    }
    start() {
        this.onStart();
    }
    onStart() {

    }
    
    creatBullet() {
        const bulletMgr = ModulerMgr.Instance.getModuler(BulletMgr)
        if(this._monsterCtrl.MonsterNode.children.length>0){
            const index  = Math.floor(Math.random()*this._monsterCtrl.MonsterNode.children.length);
            const monsNode = this._monsterCtrl.MonsterNode.children[index];
            bulletMgr.creatBullets(this.node.getWorldPosition(), this._bullet.id,monsNode);
        }
       
    }
    playAni() {
        this.idle();
    }
    default() {
        this._skeleton.paused = true;
    }
    atk() {
        this._skeleton.setAnimation(0, AniType.atk, false);
    }
    die() {
        this._skeleton.setAnimation(0, AniType.die, false);
    }
    hit() {
        this._skeleton.setAnimation(1, AniType.hit, false);
    }
    idle() {
        this._skeleton.setAnimation(0, AniType.idle, true);
    }
    walk() {
        this._skeleton.setAnimation(0, AniType.walk, true);
    }
    update(deltaTime: number) {
    }
}


