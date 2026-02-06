import { _decorator, Component, Node, Toggle, ToggleContainer, Button, sys, instantiate, find, BlockInputEvents, Sprite, Color, UITransform, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SettingManager')
export class SettingManager extends Component {
    // 伤害显示的ToggleContainer
    @property(ToggleContainer) damageToggleContainer: ToggleContainer = null;
    // 音乐/音效/孵化音效开关
    @property(Toggle) musicToggle: Toggle = null;
    @property(Toggle) soundToggle: Toggle = null;
    @property(Toggle) hatchToggle: Toggle = null;
    // 关闭/确认按钮
    @property(Button) closeBtn: Button = null;
    @property(Button) confirmBtn: Button = null;
    // 遮罩层预制体
    @property(Prefab) maskLayerPrefab: Prefab = null;

    // 遮罩层实例
    private maskLayer: Node = null;
    // 伤害模式映射
    private damageModeMap = ['显示', '隐藏', '简洁'];

    // 生命周期
    onLoad() {
        // 初始化遮罩层
        this.initMaskLayer();
        // 绑定所有事件
        this.bindAllEvents();
    }

    start() {
        // 从本地存储初始化所有开关状态
        this.initSettingFromStorage();
    }

    // 遮罩层初始化
    private initMaskLayer() {
        if (!this.maskLayerPrefab) {
            return;
        }

        // 实例化遮罩层预制体
        this.maskLayer = instantiate(this.maskLayerPrefab);
        const canvas = find('Canvas');
        if (!canvas) {
            return;
        }

        // 遮罩层挂载到Canvas，层级在设置页下方
        this.maskLayer.parent = canvas;
        this.maskLayer.setSiblingIndex(this.node.getSiblingIndex() - 1);

        // 强制设置遮罩层全屏
        const canvasUITrans = canvas.getComponent(UITransform);
        const maskUITrans = this.maskLayer.getComponent(UITransform);
        if (canvasUITrans && maskUITrans) {
            maskUITrans.contentSize = canvasUITrans.contentSize;
        }

        // 强制添加拦截点击组件
        if (!this.maskLayer.getComponent(BlockInputEvents)) {
            this.maskLayer.addComponent(BlockInputEvents);
        }

        // 强制添加暗化背景
        if (!this.maskLayer.getComponent(Sprite)) {
            const sprite = this.maskLayer.addComponent(Sprite);
            sprite.color = new Color(0, 0, 0, 180); // 黑色半透明，实现暗化虚化
        }

        // 默认隐藏遮罩层
        this.maskLayer.active = false;
    }

    private bindAllEvents() {
        // 1. 音乐/音效/孵化音效开关事件
        this.musicToggle?.node.on('toggle', (toggle: Toggle) => {
            sys.localStorage.setItem('gameMusicState', toggle.isChecked.toString());
        }, this);

        this.soundToggle?.node.on('toggle', (toggle: Toggle) => {
            sys.localStorage.setItem('gameSoundState', toggle.isChecked.toString());
        }, this);

        this.hatchToggle?.node.on('toggle', (toggle: Toggle) => {
            sys.localStorage.setItem('gameHatchState', toggle.isChecked.toString());
        }, this);

        // 2. 伤害显示按钮事件
        if (this.damageToggleContainer) {
            this.damageToggleContainer.node.children.forEach((toggleNode, index) => {
                const toggle = toggleNode.getComponent(Toggle);
                if (toggle) {
                    // 绑定点击事件：仅选中时触发
                    toggle.node.on('toggle', (t: Toggle) => {
                        if (t.isChecked) {
                            const modeName = this.damageModeMap[index];
                            sys.localStorage.setItem('damageDisplayMode', index.toString());
                        }
                    }, this);
                }
            });
        } else {

        }

        // 3. 关闭/确认按钮事件
        this.closeBtn?.node.on('click', this.hideSettingUI, this);
        this.confirmBtn?.node.on('click', this.hideSettingUI, this);
    }

    // 初始化设置
    private initSettingFromStorage() {
        // 1. 音乐/音效/孵化音效状态
        this.musicToggle.isChecked = sys.localStorage.getItem('gameMusicState') === 'true';
        this.soundToggle.isChecked = sys.localStorage.getItem('gameSoundState') === 'true';
        this.hatchToggle.isChecked = sys.localStorage.getItem('gameHatchState') === 'true';

        // 2. 伤害显示状态
        const savedIndex = Number(sys.localStorage.getItem('damageDisplayMode')) || 0;
        if (this.damageToggleContainer) {
            const targetToggle = this.damageToggleContainer.node.children[savedIndex]?.getComponent(Toggle);
            if (targetToggle) {
                targetToggle.isChecked = true;
            }
        }
    }

    // 显示/隐藏设置页
    /** 显示设置页 + 显示遮罩层（暗化背景） */
    showSettingUI() {
        this.node.active = true;
        if (this.maskLayer) {
            this.maskLayer.active = true;
        }
    }

    /** 隐藏设置页 + 隐藏遮罩层 */
    hideSettingUI() {
        this.node.active = false;
        if (this.maskLayer) {
            this.maskLayer.active = false;
        }
    }
}