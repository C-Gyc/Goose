import { DataBase } from "../FrameWork/DataMgr";

export interface RoleData extends DataBase{
    bulletid:number;
    level:number;
    hp:number
    atk:number;
    atkspeed:number;
    movespeed:number;
    def:number;
    prefab:string;
    interval:number;
}

export interface BulletData extends DataBase{
    roleid:number;
    bullet:string;
    skill:string;
    speed:number;
    bulletMode:number;
    yspeed:number[];
}

export interface CardData extends DataBase{
    type:string;
    title:string;
    picture:string;
    atk:number;
    object:string;      
    intriduce:string;
}
export interface LevalData extends DataBase{
    id:number;
    monsterids:number[];
    waves:number[]
}

export interface MounsterData extends DataBase{
    id:number
    spine:string;
    atk:number;
    speed:number
}


