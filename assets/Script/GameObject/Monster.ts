import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, find, Label, Node, Skeleton, sp, tween, UITransform, Vec2, Vec3 } from 'cc';
import { ResManager } from '../FrameWork/ResManager';
import { createNodeWithPrefab } from '../Tools/Tools';
import { DataConfig } from '../GameDatas/DataConfig';

const { ccclass, property } = _decorator;

@ccclass('Monster')
export class Monster extends Component {


    private skeleton: sp.Skeleton = null;
    private _hp: number = 100;
    private _isDead: boolean = false;
    private _collider: BoxCollider2D = null;
    private _isHitting: boolean = false;
    private _moveSpeed: number = 20;
    private _canMove: boolean = false;
    private _totalMonster:number = 0;

    protected onLoad(): void { 
        this.skeleton = this.getComponent(sp.Skeleton);
        this._collider = this.getComponent(BoxCollider2D);
    }
    init(monsterName: string,totalMonsterCount:number) {
      
        //根据数据设置相应动画
        this.skeleton.skeletonData = ResManager.Instance.getSpine(monsterName);
        this._totalMonster=totalMonsterCount;
        //设置包围盒大小
        const uiTrans = this.getComponent(UITransform);
        this._collider.size.width = uiTrans.width * this.node.scale.x;
        this._collider.size.height = uiTrans.height * this.node.scale.y;
        // 修正锚点偏移，让碰撞体居中
        this._collider.offset = new Vec2(0, 0);
        this.skeleton.setAnimation(0, 'walk', true);
        this._canMove = true;
        this._collider.enabled = true;
    }
    get IsDeaded(){
        return this._isDead;
    }
    move(deltaTime) {
        if (this._canMove && !this._isDead) {
            this.node.x -= this._moveSpeed * deltaTime;
        }

    }
    start() {
        //设置动画播放一次循环结束后的事件监听
        this.skeleton.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === "die") {
                this.randCoin()
                this.node.destroy();
            }
            if (trackEntry.animation.name === "atk") {
                if (this._canMove) {
                    this.skeleton.setAnimation(0, 'walk', true);
                }
            }
            if (trackEntry.animation.name === "hit") {
                this._isHitting = false;
                this._canMove = true;
                this.skeleton.setAnimation(0, 'walk', true);
            }
        })
        //碰撞监听
        if (this._collider) {
            this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }
    //攻击
    atk() {
        this.skeleton.setAnimation(0, 'atk', true);
        //停止移动
        this._canMove = false;
    }
    //被攻击
    hit(hp: number) {
        if(this._isHitting||this._isDead){
            return;
        }
        // 先停止当前动画
        this.skeleton.clearTrack(0);
        this.skeleton.setAnimation(0, 'hit', false);
        this._hp -= hp;
        this._isHitting = true;
        this._canMove = false;

    }

    //碰撞开始时
    onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        // 死亡/被击中时，直接拦截所有碰撞，不响应
        //if (this._isDead || this._isHitting) return;
        //怪是1，武器是2，英雄是3
        if (otherCollider.tag === 2) {
            if(selfCollider.node.getComponent(sp.Skeleton).skeletonData.name==="tusichazi"){
                this._isDead=true;
                this.die();
                return ;
            }
            this.hit(50);
            //延迟销毁，避免碰撞中断
            otherCollider.enabled=false;
            this.scheduleOnce(()=>{
                otherCollider.node.destroy();
            },0.01)
        }
        else if (otherCollider.tag === 3) {
            this.atk();
        }
    }

    //死亡概率掉落金币并增加击杀数
    randCoin() {
        let index = 1;
        let randIndex = 1;//Math.floor(Math.random()*4-1);
        if (randIndex === index) {
            const coinNode = createNodeWithPrefab('Coin', this.node.parent,  this.node.getWorldPosition())
            //金币移动到lable处
            tween(coinNode)
                .to(1.5, { position: new Vec3(600, 340, 0) })
                .call(() => {
                    DataConfig.Instance.CoinCount++;
                    coinNode.destroy();
                })
                .start();
        }
        DataConfig.Instance.KilledCount++;
        DataConfig.Instance.Percent = Math.floor(DataConfig.Instance.KilledCount/this._totalMonster*100);
    }
    //死亡
    die() {
        //切换动画
        //if (this._isDead) return;
       
        this._canMove = false;
        //关闭碰撞体，不再触发任何碰撞
        this._collider.enabled = false;
        // 解绑碰撞监听，释放性能
        this._collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.skeleton.setAnimation(0, 'die', false);
    }

    update(deltaTime: number) {
        if (this._isDead) return;
        if (this._isHitting) {
            return;
        }
        if (this._hp <= 0) {
            this._isDead = true;
            this.die();
            return;
        }
        if (this._canMove) {
            this.move(deltaTime);
        }
    }
}


