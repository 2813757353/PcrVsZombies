import { Panel } from './Panel.js'

export class Slider extends Panel {
    percent = 0
    constructor(data) {
        super(data)
    }
    draw(d) {
        this.bounds.areaWidth = this.bounds.width * this.percent
        super.draw(d)
    }
}
