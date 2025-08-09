import { Panel } from './Panel'

export class Button extends Panel {
    onclick = null
    type = {
        default: null,
        active: null,
        down: null,
    }
    constructor(data) {
        super(data)
        this.onclick = () => data.onclick(this)
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
