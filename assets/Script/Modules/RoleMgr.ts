import { _decorator, Component, instantiate, log, Node, tweenProgress, Vec3 } from 'cc';
import { ResManager } from '../FrameWork/ResManager';
import { ModulerBase } from '../FrameWork/ModulerBase';
import { BulletData, RoleData } from '../Data/DataClass';
import { RoleBase } from '../GameObject/RoleBase';
import { SteamedChicken } from '../Roles/SteamedChicken';
import { FlameWitch } from '../Roles/FlameWitch';
import { CashGrabSage } from '../Roles/CashGrabSage';
import { HolyLightNun } from '../Roles/HolyLightNun';
import { StarShooter } from '../Roles/StarShooter';
import { LifeBar } from '../Bar/LifeBar';
import { BulletBar } from '../Bar/BulletBar';
import { DataManager } from '../FrameWork/DataMgr';
import { createNodeWithPrefab } from '../Tools/Tools';
import { PrefabType } from '../Data/Prefab';
const { ccclass, property } = _decorator;

@ccclass('RoleMgr')
export class RoleMgr extends ModulerBase {
    // 存储所有脚本
    private _role: Map<string, RoleBase> = new Map();
    onStart() {
    }
    // 创建角色
    createRole(pos: Vec3, id: number) {
        // 创建角色
        const roleData: RoleData = DataManager.Instance.getDataById(id);
        const roleNode: Node = createNodeWithPrefab(roleData.prefab, this._node, pos);
        // 创建血条和子弹装填条
        this.creatLifeBar(roleNode);
        this.creatBulletBar(roleNode);
        // 找到预制体上的脚本
        let role: RoleBase = null;
        switch (id) {
            case 1001:
                role = roleNode.getComponent(CashGrabSage);
                break;
            case 1002:
                role = roleNode.getComponent(FlameWitch);
                break;
            case 1003:
                role = roleNode.getComponent(HolyLightNun);
                break;
            case 1004:
                role = roleNode.getComponent(StarShooter);
                break;
            case 1005:
                role = roleNode.getComponent(SteamedChicken);
                break;

            default:
                break;
        }
        // 并调用上面的初始化函数
        role.init(id);
    }
    // 删除角色
    removeRole() {

    }
    creatLifeBar(roleNode: Node) {
        const lifeBarNode: Node = createNodeWithPrefab(PrefabType.LifeBar, roleNode, roleNode.getWorldPosition());
        const lifeBar = lifeBarNode.getComponent(LifeBar);
    }
    creatBulletBar(roleNode: Node) {
        const bulletBarNode: Node = createNodeWithPrefab(PrefabType.BulletBar, roleNode, roleNode.getWorldPosition());
        const bulletBar = bulletBarNode.getComponent(BulletBar);
    }
}


