export class Panel {
    // 所属分组 同组内的zIndex参与排序
    static _group = {}
    // 正在绘制的分组
    static _drawing = {}
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
    bounds = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
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
        this.bounds = data.bounds ?? this.bounds
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
            ctx.drawImage(
                this.type[this.currentImg]._image,
                this.bounds.x * _scale,
                this.bounds.y * _scale,
                this.bounds.width * _scale,
                this.bounds.height * _scale
            )
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
