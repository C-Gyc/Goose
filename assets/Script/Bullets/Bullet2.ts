import { _decorator, Component, Node, Vec3 } from 'cc';
import { BulletBase } from '../GameObject/BulletBase';
import { ModulerMgr } from '../FrameWork/ModulerMgr';
import { MonsterCtrl } from '../Modules/MonsterCtrl';
import { Monster } from '../GameObject/Monster';
const { ccclass, property } = _decorator;

@ccclass('Bullet2')
export class Bullet2 extends BulletBase {
    onStart(): void {

    }
    bulletMove(dt: number, monsterNode: Node) {
        // 1. 先判断节点是否存在 + 组件是否存在
        const monsterComp = monsterNode?.getComponent(Monster);
        if (!monsterNode || !monsterComp) {
            this.node.destroy();
            return;
        }

        // 2. 再访问IsDeaded属性
        if (monsterComp.IsDeaded) {
            this.node.destroy();
            return;
        }
        const selfPos = this.node.getWorldPosition();
        const targetPos = monsterNode.getWorldPosition();
        const trackDir = new Vec3(targetPos.x - selfPos.x, targetPos.y - selfPos.y, 0);
        trackDir.normalize();
        const moveSpeed = trackDir.multiplyScalar(this._bullet.speed * dt);
        this.node.setWorldPosition(Vec3.add(new Vec3(), selfPos, moveSpeed));
        if (this.node.x >= 1280) {
            this.node.destroy();
        }


    }

}