import { Assets } from './Assets.js'
import { Utils } from '../../Utils.js'
import { Panel } from '../../GUI/Panel.js'
import { Button } from '../../GUI/Button.js'
import { Slider } from '../../GUI/Slider.js'
const BaseUrl = Assets.prefix
export class Loading {
    canvas = null
    context = null
    assetManager = new spine.canvas.AssetManager()

    baseSize = null

    // 渲染UI
    background = null
    button = null
    slider = null
    panels = []

    constructor(data) {
        this.canvas = data.canvas
        this.context = data.context
        this.baseSize = data.baseSize
        this.loadAssets()
    }
    loadAssets() {
        const files = Assets.images
        const urls = Utils.getAllUrl(files, BaseUrl)
        urls.forEach((url) => {
            this.assetManager.loadTexture(url)
        })
        this.draw = (f) =>
            this.checkLoad(() => {
                this.button.text = '点击开始'
                f()
            })
    }
    draw = null
    checkLoad(callback) {
        if (this.assetManager.isLoadingComplete()) {
            this.initBackground()
            this.initLogo()
            this.initButton()
            this.initSlider()
            if (callback instanceof Function) {
                callback()
            }
        } else {
            requestAnimationFrame(() => this.checkLoad(callback))
        }
    }
    initBackground() {
        this.background = new Panel({
            bounds: {
                x: 0,
                y: 0,
                width: this.baseSize.width,
                height: this.baseSize.height,
            },
            type: {
                default: this.assetManager.get(
                    `${BaseUrl}LoadingBackground.jpg`
                ),
            },
            group: 'loading',
        })
    }
    initLogo() {
        const _rect = {
            width: 439,
            height: 134,
        }
        const logo = new Panel({
            bounds: {
                x: this.baseSize.width / 2 - _rect.width / 2,
                y: -_rect.height,
                width: _rect.width,
                height: _rect.height,
            },
            type: {
                default: this.assetManager.get(`${BaseUrl}Logo.png`),
            },
            group: 'loading',
        })
        let timer = -1
        const _h = 60
        logo.addEvent('slidLogo', (d) => {
            if (timer === -1) {
                timer = d
                logo.speed.y = 0.03
            } else {
                logo.bounds.y = (d - timer) * logo.speed.y + logo.bounds.y
                if (logo.bounds.y > _h) {
                    logo.removeEvent('slidLogo')
                    logo.bounds.y = _h
                    logo.speed.y = 0
                }
            }
        })
        this.panels.push(logo)
    }
    initButton() {
        const _rect = {
            width: 321,
            height: 53,
        }
        const button = new Button({
            bounds: {
                x: this.baseSize.width / 2 - _rect.width / 2,
                y: this.baseSize.height,
                width: _rect.width,
                height: _rect.height,
                textX: 'center',
                textY: 33,
                fontSize: 15,
            },
            type: {
                default: this.assetManager.get(`${BaseUrl}LoadBarDirt.png`),
            },
            group: 'loading',
            onclick: () => {
                const mg = window.Base.value
                if (mg.assetManager.isLoadingComplete()) {
                    mg.setScene('mainMenu')
                }
            },
        })
        let timer = -1
        const _h = this.baseSize.height - _rect.height - 30
        button.addEvent('slidButton', (d) => {
            if (timer === -1) {
                timer = d
                button.speed.y = -0.02
            } else {
                button.bounds.y = (d - timer) * button.speed.y + button.bounds.y
                if (button.bounds.y < _h) {
                    button.removeEvent('slidButton')
                    button.bounds.y = _h
                    button.speed.y = 0
                }
            }
        })
        button.text = '加载中'
        button.font = `fzjz`
        button.textColor = '#f3b31d'
        button.activeColor = '#db6a0e'
        this.button = button
    }
    initSlider() {
        const _rect = {
            width: 314,
            height: 33,
        }
        const slider = new Slider({
            bounds: {
                x: this.baseSize.width / 2 - _rect.width / 2 - 6,
                y: this.baseSize.height,
                width: _rect.width,
                height: _rect.height,
                areaX: 0,
                areaY: 0,
                areaWidth: 0,
                areaHeight: _rect.height,
            },
            type: {
                default: this.assetManager.get(`${BaseUrl}LoadBarGrass.png`),
            },
            group: 'loading',
        })
        let timer = -1
        const _h = this.baseSize.height - _rect.height - 30 - 33
        slider.addEvent('slider', (d) => {
            if (timer === -1) {
                timer = d
                slider.speed.y = -0.02
            } else {
                slider.bounds.y = (d - timer) * slider.speed.y + slider.bounds.y
                if (slider.bounds.y < _h) {
                    slider.removeEvent('slider')
                    slider.bounds.y = _h
                    slider.speed.y = 0
                }
            }
        })
        this.slider = slider
    }
    updatePercent(p) {
        console.log(p)
        this.slider.percent = p
    }
}
