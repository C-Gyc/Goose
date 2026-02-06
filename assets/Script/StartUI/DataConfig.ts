import { DataManager } from "../FrameWork/DataMgr";

//角色属性接口
export interface RoleData {
    roleName: string;
    id: number;
    bulletid: number;
    prefab: string;
    level: number;
    hp: number;
    atk: number;
    atkspeed: number;
    movespeed: number;
    def: number;
    interval: number;
}

export class DataConfig {
    //定义静态私有变量存储唯一实例
    private static _instance: DataConfig;
    private _flash: number = 30;
    private _gold: number = 300000;
    private _beryl: number = 2000;

    private roleDataMap: Map<number, RoleData> = new Map();

    //私有化构造函数，禁止外部通过new创建实例
    private constructor() { }

    //静态方法：获取单例实例（不存在则创建）
    public static getInstance(): DataConfig {
        if (!this._instance) {
            this._instance = new DataConfig();
            this._instance.loadRoleData();
        }
        return this._instance;
    }

    private async loadRoleData() {
        try {
            //加载数据Bundle（假设RoleData.csv放在“Data”Bundle中，需在资源管理器配置）
            await DataManager.Instance.loadAllData('Data');
            const roleDatas: RoleData[] = DataManager.Instance.getAllDataByName<RoleData>('RoleData');
            if(roleDatas && roleDatas.length > 0){
                this.roleDataMap.clear();
                roleDatas.forEach(data => {
                    this.roleDataMap.set(data.id, data);
                });
            }
        }
        catch (err) {
            console.error("加载RoleData失败：", err);
        }
    }

    public updateRoleLevel(roleId: number, newLevel: number, newHp: number, newATK: number){
        const roleData = this.roleDataMap.get(roleId);
        if(roleData){
            roleData.level = newLevel;
            roleData.hp = newHp;
            roleData.atk = newATK;
        }
    }

    public getRoleDataById(roleId: number): RoleData | null{
        return this.roleDataMap.get(roleId) || null;
    }

    public getPrefabByName(roleId: number): string {
        //获取英雄数据
        const roleData: RoleData = this.getRoleDataById(roleId);
        return roleData.prefab;
    }
    public getHpByName(roleId: number): number {
        //获取英雄数据
        const roleData: RoleData = this.getRoleDataById(roleId);
        return roleData.hp;
    }
    public getAtkByName(roleId: number): number {
        //获取英雄数据
        const roleData: RoleData = this.getRoleDataById(roleId);
        return roleData.atk;
    }
    public getLevelByName(roleId: number): number {
        //获取英雄数据
        const roleData: RoleData = this.getRoleDataById(roleId);
        return roleData.level;
    }


    //体力
    set Flash(flash: number) {
        this._flash = flash;
    }
    get Flash() {
        return this._flash;
    }

    //金币
    set Gold(gold: number) {
        this._gold = gold;
    }
    get Gold() {
        return this._gold;
    }

    //绿宝石
    set Beryl(beryl: number) {
        this._beryl = beryl;
    }
    get Beryl() {
        return this._beryl;
    }

}

export const RolePrefabMap = {
    "HolyLightNun": "HolyLightNunSkeleton",
    "FlameWitch": "FlameWitchSkeleton",
    "SteamedChicken": "SteamedChickenSkeleton",
    "CashGrabSage": "CashGrabSageSkeleton"
}
