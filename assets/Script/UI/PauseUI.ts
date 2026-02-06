import { _decorator, Component, director, Node } from 'cc';
import { PopWin } from '../FrameWork/UIBase';
const { ccclass, property } = _decorator;

@ccclass('PauseUI')
export class PauseUI extends PopWin{
    continue(){
        this.hide();
        director.resume();
    }
}


