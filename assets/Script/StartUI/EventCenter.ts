type EventCallback = (data?: any) => void;

export class EventCenter {
    private static _events: Record<string, EventCallback[]> = {};

    //监听事件
    public static on(eventName: string, callback: EventCallback){
        if(!this._events[eventName]){
            this._events[eventName] = [];
        }
        this._events[eventName].push(callback);
    }

    //触发事件
    public static emit(eventName: string, data?: any){
        const callbacks = this._events[eventName];
        if(callbacks){
            callbacks.forEach(callback => callback(data));
        }
    }

    //移除事件监听
    public static off(eventName: string, callback: EventCallback){
        const callbacks = this._events[eventName];
        if(callbacks){
            const index = callbacks.indexOf(callback);
            if(index > -1){
                callbacks.splice(index, 1);
            }
        }
    }
}