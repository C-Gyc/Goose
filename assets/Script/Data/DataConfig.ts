export class DataConfig{
    //定义静态私有变量存储唯一实例
    private static _instance: DataConfig;
    private _flash: number = 0;
    private _gold: number = 0;
    private _beryl: number = 0;

    //私有化构造函数，禁止外部通过new创建实例
    private constructor(){}

    //静态方法：获取单例实例（不存在则创建）
    public static getInstance():DataConfig{
        if(!this._instance){
            this._instance = new DataConfig();
        }
        return this._instance;
    }
    //体力
    set Flash(flash:number){
        this._flash = flash;
    }
    get Flash(){
        return this._flash;
    }

    //金币
    set Gold(gold: number){
        this._gold = gold;
    }
    get Gold(){
        return this._gold;
    }

    //绿宝石
    set Beryl(beryl: number){
        this._beryl = beryl;
    }
    get Beryl(){
        return this._beryl;
    }
}
