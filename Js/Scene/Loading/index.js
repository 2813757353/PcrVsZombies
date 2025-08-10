import { Assets } from './Assets.js'
import { Utils } from '../../Utils.js'
import { Panel } from '../../GUI/Panel.js'
import { Button } from '../../GUI/Button.js'
const BaseUrl = Assets.prefix
export class Loading {
    canvas = null
    context = null
    assetsManager = new spine.canvas.AssetManager()

    baseSize = null

    // 渲染UI
    background = null
    button = null
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
            this.assetsManager.loadTexture(url)
        })
        this.draw = (f) => this.checkLoad(f)
    }
    draw = null
    checkLoad(callback) {
        if (this.assetsManager.isLoadingComplete()) {
            this.initBackground()
            this.initLogo()
            this.initButton()
            Panel._drawing.loading_ui = true
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
                default: this.assetsManager.get(
                    `${BaseUrl}LoadingBackground.jpg`
                ),
            },
            group: 'loading_ui',
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
                default: this.assetsManager.get(`${BaseUrl}Logo.png`),
            },
            group: 'loading_ui',
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
            },
            type: {
                default: this.assetsManager.get(`${BaseUrl}LoadBarDirt.png`),
            },
            group: 'loading_ui',
        })
        let timer = -1
        const _h = this.baseSize.height - _rect.height - 40
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
        this.button = button
    }
}
