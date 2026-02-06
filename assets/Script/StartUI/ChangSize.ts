import { _decorator, Component, log, Node, PageView, Tween, tween, Vec3 } from 'cc';
import { DataConfig } from './DataConfig';
const { ccclass, property } = _decorator;

@ccclass('ChangSize')
export class ChangSize extends Component {
    @property(PageView)
    pageView: PageView = null;

    @property
    selectedScale: number = 1.2;

    @property
    normalScale: number = 0.8;
    onLoad(){
        if(!this.pageView){return;}

        this.pageView.node.on('page-turning', this.onPageTurning, this);
        this.resetAllItemScale();
        this.setSelectedItemScale(this.pageView.getCurrentPageIndex());
    }
    //重置所有Item的缩放
    resetAllItemScale(){
        const items = this.pageView.content.children;
        for (const item of items) {
            tween(item)
            .to(0.2,{scale: new Vec3(this.normalScale, this.normalScale, 1)})
            .start();
            
        }
    }
    //放大选中的的item
    setSelectedItemScale(index: number){
        const selectedItem = this.pageView.content.children[index];
        if(!selectedItem){return;}
        //关闭旧动画
        Tween.stopAllByTarget(selectedItem);
        tween(selectedItem)
        .to(0.2,{scale: new Vec3(this.selectedScale, this.selectedScale, 1)})
        .start();
        
    }

    onPageTurning(){
        this.resetAllItemScale();
        this.scheduleOnce(()=>{
            this.setSelectedItemScale(this.pageView.getCurrentPageIndex());
        }, 0);
    }
    
}


