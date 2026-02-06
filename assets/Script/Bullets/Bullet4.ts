import { _decorator, Component, Node } from 'cc';
import { BulletBase } from '../GameObject/BulletBase';
import { DataConfig } from '../GameDatas/DataConfig';
const { ccclass, property } = _decorator;

@ccclass('Bullet4')
export class Bullet4 extends BulletBase {
    bulletMove(dt: number) {
        //计数
        DataConfig.Instance.Count = DataConfig.Instance.Count % this._bullet.yspeed.length;
        //this.node.y += this._bullet.yspeed[DataConfig.Instance.Count] * dt;
        this.node.x += this._bullet.speed * dt;
        DataConfig.Instance.Count++;
        if(this.node.x>=1280){
            this.node.destroy();
        }
    }
}


