import { Panel } from './Panel.js'

export class Button extends Panel {
    onclick = null
    type = {
        default: null,
        active: null,
        mousedown: null,
    }
    cursor = 'pointer'
    btnUpTime = 300
    constructor(data) {
        super(data)
        this._reInit(data)
    }
    _reInit(data) {
        this.btnUpTime = data.btnUpTime ?? this.btnUpTime
        this.type = data.type ?? this.type
        if (data.onclick instanceof Function) {
            // 绑定事件
            this.onclick = () => data.onclick(this)
            if (!this._events.mousedown) {
                this._events.mousedown = (e) => {
                    const _scale = Panel._scale
                    if (this._check({ x: e.x / _scale, y: e.y / _scale })) {
                        this.currentImg = this.type.mousedown
                            ? 'mousedown'
                            : 'default'
                        setTimeout(() => {
                            this.currentImg = 'default'
                        }, this.btnUpTime)
                        return this.eventPopup
                    }
                    return false
                }
                this._events.mouseup = (e) => {
                    const _scale = Panel._scale
                    if (this._check({ x: e.x / _scale, y: e.y / _scale })) {
                        this.onclick()
                        return this.eventPopup
                    }
                    return false
                }
            }
        }
        // 绑定激活
        if (!this._events.mousemove) {
            this._events.mousemove = (e) => {
                const _scale = Panel._scale
                const gm = window.Base.value
                if (this._check({ x: e.x / _scale, y: e.y / _scale })) {
                    this.active = true
                    this.currentImg = this.type.active ? 'active' : 'default'
                    gm.canvas.style.cursor = this.cursor
                    return this.eventPopup
                } else {
                    this.active = false
                    gm.canvas.style.cursor = 'default'
                    this.currentImg = 'default'
                }
                return false
            }
        }
    }
    setCurrent(type) {
        this.currentImg = type
    }
    getCurrent() {
        return this.currentImg
    }
    _check({ x, y }) {
        const rect = {
            left: this.bounds.x,
            top: this.bounds.y,
            right: this.bounds.x + this.bounds.width,
            bottom: this.bounds.y + this.bounds.height,
        }
        if (
            rect.left > x ||
            rect.top > y ||
            rect.right < x ||
            rect.bottom < y
        ) {
            return false
        }
        return true
    }
}
