export class Panel {
    static _group = {}
    bounds = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    }
    zIndex = 0
    type = {
        default: null,
    }
    currentImg = 'default'
    canvas = null
    context = null
    constructor(data) {
        this.bounds = data.bounds ?? this.bounds
        this.zIndex = data.zIndex ?? this.zIndex
        this.type = data.type ?? this.type
        this.context = data.context
        this.canvas = data.canvas
        this.group = data.group ?? 'default'
        if (_group[this.group]) {
            _group[this.group].push(this)
        } else {
            _group[this.group] = [this]
        }
        _group[this.group] = _group[this.group].sort((a, b) => a - b)
    }

    setPosition(x, y) {
        this.bounds.x = x
        this.bounds.y = y
    }
    setSize(width, height) {
        this.bounds.width = width
        this.bounds.height = height
    }
    draw() {
        const ctx = this.context
        if (this.currentImg && this.type[this.currentImg]) {
            ctx.drawImage(
                this.type[this.currentImg],
                this.bounds.x,
                this.bounds.y,
                this.bounds.width,
                this.bounds.height
            )
        }
    }
}
