import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { DataManager } from '../FrameWork/DataMgr';
import { CardData } from '../Data/DataClass';
import { ResManager } from '../FrameWork/ResManager';
const { ccclass, property } = _decorator;

@ccclass('Card')
export class Card extends Component {
    private _title:Label =null;
    private _picture:Sprite =null;
    private _intriduce :Label =null;
    protected onLoad(): void {
        this._title = this.node.getChildByName("Title").getComponent(Label);
        this._intriduce = this.node.getChildByName("Intriduce").getComponent(Label);
        this._picture = this.getComponentInChildren(Sprite);
        }
    start() {

    }
    init(id:number){
        //卡片内容初始化
        const datas:CardData = DataManager.Instance.getDataById(id,"CardData");
        this._title.string = datas.title;
        this._picture.spriteFrame = ResManager.Instance.getSpriteFrame(datas.picture);
        this._intriduce.string = datas.intriduce;
    }
    update(deltaTime: number) {
        
    }
}


