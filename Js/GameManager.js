import { Utils } from './Utils.js'
export class GameManager {
    events = {
        mouseup: (e) => {},
        mousedown: (e) => {},
        mousemove: (e) => {},
        keyup: (e) => {},
        keydown: (e) => {},
        resize: () => {
            let _w = window.innerWidth
            let _h = window.innerHeight
            const _n = _h * this.percent
            if (_n < _w) {
                _w = _n
            } else {
                _h = _w / this.percent
            }
            this.canvas.style.width = `${_w}px`
            this.canvas.style.height = `${_h}px`
            this.canvas.width = _w
            this.canvas.height = _h
        },
    }
    canvas = null
    context = null
    percent = null
    assets = null
    animFrame = null
    render = null
    delta = 0
    fps = true
    assetManager = new spine.canvas.AssetManager()
    constructor(data) {
        this.canvas = data.canvas
        this.context = data.context
        this.percent = data.percent
        this.assets = data.assets
        this.render = new spine.canvas.SkeletonRenderer(data.contex)
        this.render.triangleRendering = true
        this.events.resize()
        this.loadAssets()
    }
    loadAssets() {
        // 读取普通图片
        this.assets._types.default.forEach((key) => {
            const { list, prefix } = this.assets[key]
            const urls = Utils.getAllUrl(list, prefix)
            urls.forEach((url) => {
                Utils.loadAsset(this.assetManager, url)
            })
        })
        // 读取spine资源
        this.assets._types.spine.forEach((key) => {
            const { list, prefix } = this.assets[key]
            const _list = list.reduce((pre, cur) => {
                const item = {
                    skel: `${cur.skel}.skel`,
                    atlas: `${cur.key}.atlas`,
                    img: `${cur.key}.png`,
                }
                pre.push(item)
                return pre
            }, [])
            const urls = Utils.getAllUrl(_list, prefix)
            urls.forEach((url) => {
                Utils.loadAsset(this.assetManager, url)
            })
        })
        this.checkLoad()
    }
    checkLoad() {
        console.log('check', this.assetManager.toLoad)
        if (this.assetManager.isLoadingComplete()) {
            this.animFrame = requestAnimationFrame((d) => this.draw(d))
        } else {
            this.animFrame = requestAnimationFrame(() => this.checkLoad())
        }
    }
    draw(delta) {
        const _delta = delta - this.delta
        const ctx = this.context
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        if (this.fps) {
            const fps = (1000 / _delta).toFixed(0)
            ctx.save()
            ctx.fillStyle = '#fff'
            ctx.fillText(`FPS:${fps}`, 20, 20)
            ctx.restore()
        }
        this.delta = delta
        this.animFrame = requestAnimationFrame((d) => this.draw(d))
    }
}
