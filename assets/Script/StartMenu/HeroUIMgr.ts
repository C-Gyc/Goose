import { _decorator, Component, find, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HeroUIMgr')
export class HeroUIMgr extends Component {
    // 返回按钮的点击事件回调
    onClickBackBtn(){
        const startUI = find('Canvas/StartUI');
        if(startUI){
            startUI.active = true;
        }
        this.node.active = false;
    }
    start() {

    }

    update(deltaTime: number) {
        
    }
}


