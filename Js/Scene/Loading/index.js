import { Assets } from './Assets.js'
export class Loading {
    canvas = null
    context = null
    events = {
        mouseup: (e) => {},
        mousedown: (e) => {},
        mousemove: (e) => {},
    }
    assetsManager = new spine.canvas.assetsManager()
    constructor(data) {
        this.canvas = data.canvas
        this.context = data.context
        this.loadAssets()
    }
    loadAssets() {}
}
