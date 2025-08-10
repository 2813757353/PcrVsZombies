import { Panel } from './Panel.js'

export class Button extends Panel {
    onclick = null
    type = {
        default: null,
        active: null,
        mousedown: null,
    }
    btnUpTime = 300
    constructor(data) {
        super(data)
        this._reInit(data)
    }
    _reInit(data) {
        const _scale = Panel._scale
        this.btnUpTime = data.btnUpTime ?? this.btnUpTime
        this.type = data.type ?? this.type
        if (data.onclick instanceof Function) {
            // 绑定事件
            this.onclick = () => data.onclick(this)
            if (!this._events.mousedown) {
                this._events.mousedown = (e) => {
                    if (this._check({ x: e.x / _scale, y: e.y / _scale })) {
                        this.currentImg =
                            this.type.mousedown ?? this.type.default
                        setTimeout(() => {
                            this.currentImg = this.type.default
                        }, this.btnUpTime)
                        return this.eventPopup
                    }
                    return false
                }
                this._events.mouseup = (e) => {
                    if (this._check({ x: e.x / _scale, y: e.y / _scale })) {
                        this.onclick()
                        return this.eventPopup
                    }
                    return false
                }
            }
        }
        // 绑定激活
        if (this.type.active && this._events.mousemove) {
            this._events.mousemove = (e) => {
                if (this._check({ x: e.x / _scale, y: e.y / _scale })) {
                    this.currentImg = this.type.active
                    return this.eventPopup
                } else {
                    this.currentImg = this.type.default
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
