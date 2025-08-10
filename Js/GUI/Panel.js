export class Panel {
    // 所属分组 同组内的zIndex参与排序
    static _group = { default: [] }
    // 正在绘制的分组
    static _drawing = { default: true }
    static _scale = 1
    /*事件合集
        mouseup
        mousedown
        mousemove
        keyup: { key: function }
        keydown: { key: function }
            keyEvent组合键: ctrl_key\alt_key
    */
    _events = {}
    text = ''
    font = ''
    textColor = '#000000'
    activeColor = '#000000'
    active = false
    bounds = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        areaX: 0,
        areaY: 0,
        areaWidth: -1,
        areaHeight: -1,
        textX: 0,
        textY: 0,
    }
    //移动速度
    speed = {}
    // 排序
    zIndex = 0
    // 记录上一次渲染时间
    delta = 0
    // 记录时间事件
    deltaEvents = {}
    type = {
        default: null,
    }
    // 当前渲染的type的key
    currentImg = 'default'
    // 事件冒泡
    eventPopup = false
    canvas = null
    context = null
    constructor(data) {
        const _group = Panel._group
        this.bounds = { ...this.bounds, ...(data.bounds ?? this.bounds) }
        this.zIndex = data.zIndex ?? this.zIndex
        this.type = data.type ?? this.type
        this.context = data.context ?? Panel._context
        this.canvas = data.canvas ?? Panel._canvas
        this.group = data.group ?? 'default'
        if (_group[this.group]) {
            _group[this.group].push(this)
        } else {
            _group[this.group] = [this]
        }
        _group[this.group] = _group[this.group].sort(
            (a, b) => a.zIndex - b.zIndex
        )
    }

    setPosition(x, y) {
        this.bounds.x = x
        this.bounds.y = y
    }
    setSize(width, height) {
        this.bounds.width = width
        this.bounds.height = height
    }
    draw(d) {
        const _scale = Panel._scale
        const ctx = this.context
        if (this.currentImg && this.type[this.currentImg]) {
            if (this.bounds.areaWidth === -1 && this.bounds.areaHeight === -1) {
                ctx.drawImage(
                    this.type[this.currentImg]._image,
                    this.bounds.x * _scale,
                    this.bounds.y * _scale,
                    this.bounds.width * _scale,
                    this.bounds.height * _scale
                )
            } else {
                ctx.drawImage(
                    this.type[this.currentImg]._image,
                    this.bounds.areaX,
                    this.bounds.areaY,
                    this.bounds.areaWidth,
                    this.bounds.areaHeight,
                    this.bounds.x * _scale,
                    this.bounds.y * _scale,
                    this.bounds.width * _scale,
                    this.bounds.height * _scale
                )
            }
        }
        if (this.text) {
            let _textX = 0
            let _textY = _scale * (this.bounds.textY + this.bounds.y)
            if (typeof this.bounds.textX === 'string') {
                const len = this.bounds.fontSize * this.text.length
                switch (this.bounds.textX) {
                    case 'center': {
                        _textX = (this.bounds.width / 2 - len / 2) * _scale
                        break
                    }
                    case 'left': {
                        _textX = 0
                        break
                    }
                    case 'right': {
                        _textX = (this.bounds.width - len) * _scale
                        break
                    }
                }
            } else {
                _textX = this.bounds.textX * _scale
            }
            _textX += this.bounds.x * _scale
            ctx.save()
            if (this.font) {
                ctx.font = `${this.bounds.fontSize * _scale}px ${this.font}`
            }
            ctx.fillStyle =
                this.active && this.activeColor
                    ? this.activeColor
                    : this.textColor
            ctx.fillText(this.text, _textX, _textY)
            ctx.restore()
        }

        Object.keys(this.deltaEvents).forEach((key) => {
            this.deltaEvents[key](d)
        })
        this.delta = d
    }
    destroy() {
        const index = Panel._group[this.group].findIndex(
            (item) => item === this
        )
        if (index !== -1) Panel._group[this.group].splice(index, 1)
    }
    addEvent(key, call) {
        this.deltaEvents[key] = call
    }
    removeEvent(key) {
        delete this.deltaEvents[key]
    }
}
