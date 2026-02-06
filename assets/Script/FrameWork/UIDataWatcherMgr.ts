/**
 * 观察者，用于保存目标对象与回调函数，当数据变化时触发回调以刷新 UI
 */
class Watcher{
    /** 绑定回调时使用的 this 对象（目标） */
    private _target:any =null;
    /** 回调函数：接收更新后的值 */
    private _callback:(value)=>void = null;

    /**
     * @param target 回调执行上下文（this）
     * @param call 回调函数，签名为 (value) => void
     */
    constructor(target:any,call:(value)=>void){
        this._target=target ;
        this._callback = call;
    }

    /** 调用回调以刷新 UI，传入最新的值 */
    refreshUI(value){
        this._callback.call(this._target,value);
    }

    /** 判断当前观察者是否和指定目标相等（用于移除）
     * 注意：此处为简单比较，返回布尔值
     */
    equla(target:any){
        return this._target =target;
    }
}


/**
 * 绑定控制器：负责将数据对象上的某个 key 与多个 Watcher 绑定
 * 当该 key 值被设置时，会通知所有注册的 Watcher
 */
class UIBindCtrl {
    /** 记录所有注册的观察者 */
    private _watchers:Watcher[]= [];

    /** 被绑定的数据对象 */
    private _data:any =null;
    /** 被绑定的属性 key */
    private _key:string =null;
    /**
     * @param data 要绑定的对象
     * @param key 对象上的属性名
     */
    constructor(data:any,key:string){
        this._data =data ;
        this._key =key;
        this._bindData(data,key);
    }

    /** 判断当前绑定是否匹配指定的数据与 key */
    equlas(data:any,key:string){
        return this._data ===data &&this._key === key;
    }

    /**
     * 使用 `Object.defineProperty` 在 data 上拦截 key 的 get/set
     * 在 set 时通知所有的 watcher
     */
    private _bindData(data:any,key:string){
        let self =this;
        let v= data[key];
        Object.defineProperty(data,key,{
            get(){
                return v;
            },
            set(value){
                v=value;
                for(const wat of self._watchers){
                    wat.refreshUI(v);
                }
            }
        })
    }

    /** 注册一个观察者 */
    addWatcher(wat:Watcher){
        this._watchers.push(wat);
    }

    /**
     * 根据目标对象移除对应的观察者
     * @param target 用于比较的目标对象（与 Watcher._target 比较）
     */
    removeWatcher(target:any){
        for(let i= 0;i<this._watchers.length;i++){
            const wat = this._watchers[i];
            if(wat.equla(target)){
                this._watchers.splice(i--);
            }
        }
    }
}


export class UIDataWatcherMgr {
    private _binds: UIBindCtrl[] = [];
    private static _instance: UIDataWatcherMgr = null;
    private constructor() { }
    static get Instance(): UIDataWatcherMgr {
        if (!this._instance) {
            this._instance = new UIDataWatcherMgr();
        }
        return this._instance;
    }
    /**
     * 添加数据绑定：将 `data[key]` 与 `target` 的回调绑定
     * @param data 要绑定的数据对象
     * @param key 数据对象上的属性名
     * @param target 回调执行上下文（this）
     * @param callback 当数据变化时调用，签名为 (value) => void
     */
    addUIBind(data:any,key:string,target:any,callback:(value:any)=>void){
        let bind = this._getUIBind(data,key);
        if(!bind){
            const bind = new UIBindCtrl(data,key);
            this._binds.push(bind);
        }
        const wat = new Watcher(target,callback);
        bind.addWatcher(wat);
    }

    /**
     * 根据目标对象移除所有绑定（遍历所有 UIBindCtrl 并请求其移除）
     * @param target 目标对象，用于匹配并移除对应 Watcher
     */
    removeBind(target:any){
        for(const bind of this._binds){
            bind.removeWatcher(target);
        }
    }

    /** 查找是否已存在对应的 UIBindCtrl */
    private _getUIBind(data:any,key: string){
        for(const bind of this._binds){
            if(bind.equlas(data,key)){
                return bind;
            }
        }
        return null;
    }
}

