import { Utils } from './Utils.js'
import { Panel } from './GUI/Panel.js'
import { Loading } from './Scene/Loading/index.js'
export class GameManager {
    events = {
        mouseup: (e) => {
            baseMouseEvent('mouseup', this.canvas, e)
        },
        mousedown: (e) => {
            baseMouseEvent('mousedown', this.canvas, e)
        },
        mousemove: (e) => {
            baseMouseEvent('mousemove', this.canvas, e)
        },
        keyup: (e) => {
            baseKeyEvent('keyup', e)
        },
        keydown: (e) => {
            baseKeyEvent('keydown', e)
        },
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
            Panel._scale = _w / this.baseSize.width
            console.log(Panel._scale)
        },
    }
    canvas = null
    context = null
    // 宽高比
    percent = null
    // 资源url
    assets = null
    // frame标识
    animFrame = null
    // 渲染spine
    render = null
    // 基准宽高
    baseSize = null
    // 记录上一次动画的时间
    delta = 0
    fps = true
    assetManager = new spine.canvas.AssetManager()
    scenes = {
        loading: null,
        mainMenu: null,
        gameing: null,
    }
    showScene = null
    constructor(data) {
        this.canvas = data.canvas
        this.context = data.context
        Panel._canvas = data.canvas
        Panel._context = data.context
        this.percent = data.percent
        this.assets = data.assets
        this.render = new spine.canvas.SkeletonRenderer(data.contex)
        this.render.triangleRendering = true
        this.baseSize = data.baseSize
        this.events.resize()
        this.scenes.loading = new Loading({
            canvas: this.canvas,
            context: this.context,
            baseSize: this.baseSize,
        })
        this.setScene('loading')
        this.scenes.loading.draw(() =>
            this.loadAssets((p) => this.scenes.loading.updatePercent(p))
        )
    }
    loadAssets(call) {
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
        this.checkLoad(call)
    }
    checkLoad(call) {
        if (this.assetManager.isLoadingComplete()) {
            call(1)
            this.animFrame = requestAnimationFrame((d) => this.draw(d))
        } else {
            call(
                this.assetManager.loaded /
                    (this.assetManager.loaded + this.assetManager.toLoad)
            )
            this.animFrame = requestAnimationFrame(() => this.checkLoad(call))
        }
    }
    draw(delta) {
        const _delta = delta - this.delta
        const ctx = this.context
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        Object.keys(Panel._drawing).forEach((key) => {
            if (Panel._group?.[key] && Panel._drawing[key])
                Panel._group[key].forEach((item) => {
                    item.draw(delta)
                })
        })

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
    setScene(key) {
        this.showScene = key
        const obj = { ...Panel._drawing }
        delete obj.default
        Object.keys(obj).forEach((_key) => {
            Panel._drawing[_key] = false
        })
        Panel._drawing[key] = true
    }
}

function baseMouseEvent(eventName, dom, e) {
    if (e.target !== dom) return
    const x = e.offsetX
    const y = e.offsetY
    const _groups = Object.keys(Panel._group)
    for (let key of _groups) {
        const list = Panel._group[key].sort((a, b) => b.zIndex - a.zIndex)
        for (let item of list) {
            if (item._events?.[eventName] instanceof Function) {
                if (item._events[eventName]({ x, y })) return
            }
        }
    }
}

function baseKeyEvent(eventName, e) {
    const _groups = Object.keys(Panel._group)
    for (let key of _groups) {
        const list = Panel._group[key].sort((a, b) => b.zIndex - a.zIndex)
        for (let item of list) {
            let keyOfB = `${e.ctrlKey ? 'CTRL_' : ''}${e.altKey ? 'ALT_' : ''}${
                e.shiftKey ? 'SHIFT_' : ''
            }${e.key.toUpperCase()}`
            if (item._events?.[eventName]?.[keyOfB] instanceof Function) {
                if (item._events?.[eventName]?.[keyOfB]()) return
            }
        }
    }
}
