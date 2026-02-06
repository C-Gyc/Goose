import { _decorator, Component, Node, Skeleton, sp, UITransform, Vec3, view } from 'cc';
import { createNodeWithPrefab } from '../Tools/Tools';
import { Monster } from '../GameObject/Monster';
import { ModulerBase } from '../FrameWork/ModulerBase';
import { DataManager } from '../FrameWork/DataMgr';
import { LevalData, MounsterData } from '../Data/DataClass';
import { DataConfig } from '../GameDatas/DataConfig';
const { ccclass, property } = _decorator;
@ccclass('MonsterCtrl')
export class MonsterCtrl extends ModulerBase {
    private _totalWaves: number = 0;
    private _curWave: number = 0;
    private _monsterPerRow: number = 6;
    private _spacingY: number = 100;
    private _startPos: Vec3 = null;
    private _curCount: number = 0;
    private _curWaveMax: number = 0;
    private _levalData: LevalData = null;
    private _totalMonsterCount:number = 0;
    //private _atkPos:Vec3 =null;
    private _monsterNode: Node = null;
    onStart() {
        const lvId:number = Number('300'+`${DataConfig.Instance.LV+1}`);
        this._levalData = DataManager.Instance.getDataById(lvId);
        this._totalWaves = this._levalData.monsterids.length;
        for (let index = 0; index < this._levalData.waves.length; index++) {
           this._totalMonsterCount+=this._levalData.waves[index];
            
        }
        const wigth = this._node.parent.getComponent(UITransform).width;
        const height = this._node.parent.getComponent(UITransform).height;
        this._startPos = new Vec3(wigth, height / 2 - 280); 
        this.schedule(this.createMonster, 1.5);
    }
    //按波次生成怪
    createMonster() {
        // 计算当前怪物的排列坐标
        const colIndex = this._curCount % this._monsterPerRow;
        const monsterPos = new Vec3(
            this._startPos.x,
            this._startPos.y + colIndex * this._spacingY,
            0
        );
        this._monsterNode = createNodeWithPrefab("Monster", this._node, monsterPos);

        this._curWaveMax = this._levalData.waves[this._curWave];
        let monsterId = this._levalData.monsterids[this._curWave];
        const monsterData: MounsterData = DataManager.Instance.getDataById(monsterId);
        this._monsterNode.getComponent(Monster).init(monsterData.spine,this._totalMonsterCount);
        //计数
        this._curCount++;
        //达到当前这一波所需数量
        if (this._curCount >= this._curWaveMax) {
            this.unschedule(this.createMonster);
            this._curWave++;
            //当超过最大波次时
            if (this._curWave >= this._totalWaves) {
                return;
            }
            this.scheduleOnce(() => {
                this._curCount = 0;
                this.schedule(this.createMonster, 1.5);
            }, 3)
        }
    }
    // get AtkPos(){
    //     return this._atkPos;
    // }
    get MonsterNode() {
        return this._node;
    }
    update(deltaTime: number) {

    }
}


