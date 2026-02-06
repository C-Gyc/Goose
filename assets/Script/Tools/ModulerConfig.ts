import { BulletMgr } from "../Modules/BulletMgr";
import { MonsterCtrl } from "../Modules/MonsterCtrl";
import { RoleMgr } from "../Modules/RoleMgr";

export const Modulers = {
    roleMgr: RoleMgr,
    monsterCtrl: MonsterCtrl,
    bulletMgr:BulletMgr
}

export enum ModulerName {
    RoleMgr = "roleMgr",
    MonsterCtrl="monsterCtrl",
     BulletMgr =" bulletMgr"
}