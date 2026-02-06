import { _decorator, Component, Node, Vec3 } from 'cc';
import { ModulerBase } from '../FrameWork/ModulerBase';
import { BulletData, RoleData } from '../Data/DataClass';


import { BulletBase } from '../GameObject/BulletBase';

import { Bullet4 } from '../Bullets/Bullet4';
import { Bullet1 } from '../Bullets/Bullet1';
import { Bullet2 } from '../Bullets/Bullet2';
import { Bullet3 } from '../Bullets/Bullet3';
import { DataManager } from '../FrameWork/DataMgr';
import { createNodeWithPrefab } from '../Tools/Tools';
const { ccclass, property } = _decorator;

@ccclass('BulletMgr')
export class BulletMgr extends ModulerBase {
    private _role: RoleData = null;
    private _bullet: BulletData = null;
    onStart(): void {
       
    }
    creatBullets(pos: Vec3, bulletid: number,objectNode:Node) {
        // 获取数据
        this._bullet = DataManager.Instance.getDataById(bulletid);
        this._role = DataManager.Instance.getDataById(this._bullet.roleid);
        // 调子弹位置
        pos = this.setPos(new Vec3(pos.x+20,pos.y,0));
        // 开火
        this.fire(pos,objectNode);

    }

    creatBullet(pos: Vec3,objectNode:Node) {
        const bulletNode: Node = createNodeWithPrefab(this._bullet.bullet, this._node, pos);
        let bullet: BulletBase = null;
        // 判断子弹类型
        switch (this._bullet.bulletMode) {
            case 1:
                bullet = bulletNode.getComponent(Bullet1);
                break;
            case 2:
                bullet = bulletNode.getComponent(Bullet2);
                break;
            case 3:
                bullet = bulletNode.getComponent(Bullet3);
                break;
            case 4:
                bullet = bulletNode.getComponent(Bullet4);
                break;
            default:
                break;
        }
        bullet.init(this._bullet.id,objectNode);
    }

    setPos(pos: Vec3): Vec3 {
        switch (this._role.id) {
            case 1001:
                pos.y += 45;
                pos.x += 50;
                break;
            case 1002:
                pos.y += 40;
                break;
            case 1003:
                pos.y += 45;
                pos.x += 50;
                break;
            case 1004:
                pos.y += 60;
                break;
            case 1005:

                break;
            default:
                break;
        }
        return pos;
    }
    fire(pos: Vec3,objectNode:Node) {
        switch (this._bullet.bulletMode) {
            case 1:

                break;
            case 2:
                this.creatBullet(pos,objectNode);
                break;
            case 3:

                break;
            case 4:
                for (let i = 0; i <= 2; i++) {
                    this.creatBullet(pos,objectNode);
                }
                break;
            default:
                break;
        }
    }
}


