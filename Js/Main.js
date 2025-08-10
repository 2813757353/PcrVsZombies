import { GameManager } from './GameManager.js'
var Base = {
    value: null,
    assets: {},
    bindEvent() {
        document.addEventListener('mousemove', (e) => {
            this.value.events.mousemove(e)
        })
        document.addEventListener('mousedown', (e) => {
            this.value.events.mousedown(e)
        })
        document.addEventListener('mouseup', (e) => {
            this.value.events.mouseup(e)
        })
        document.addEventListener('keyup', (e) => {
            this.value.events.keyup(e)
        })
        document.addEventListener('keydown', (e) => {
            this.value.events.keydown(e)
        })
        window.addEventListener('resize', () => {
            this.value.events.resize()
        })
    },
}
window.onload = () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    Base.value = new GameManager({
        context,
        canvas,
        percent: 1080 / 600,
        baseSize: {
            width: 1080,
            height: 600,
        },
        assets: Base.assets,
    })
    Base.bindEvent()
}
Base.assets._types = {
    default: ['backgrounds'],
    spine: ['roles'],
}
Base.assets.roles = {
    prefix: './Assets/Spines/',
    list: [
        {
            key: 102811,
            skel: 102811,
        },
        {
            key: 102831,
            skel: 102811,
        },
        {
            key: 102861,
            skel: 102811,
        },
        {
            key: 106011,
            skel: 106011,
        },
        {
            key: 106031,
            skel: 106011,
        },
        {
            key: 106061,
            skel: 106011,
        },
    ],
}
Base.assets.backgrounds = {
    prefix: './Assets/Texture/TowerDefense/Backgorund/',
    list: [
        {
            key: 'day',
            normal: {
                front: 'Frontlawn.jpg',
                doorBorder: 'FrontlawnDoor.png',
                door: 'FrontlawnFloor.png',
            },
            cold: {
                front: 'FrontlawnCold.jpg',
                doorBorder: 'FrontlawnDoor.png',
                door: 'FrontlawnFloor.png',
            },
            none: {
                front: 'FrontlawnEmpty.jpg',
                doorBorder: 'FrontlawnDoor.png',
                door: 'FrontlawnFloor.png',
                one: 'FrontlawnSod1Row.png',
                three: 'FrontlawnSod3Row.png',
            },
        },
        {
            key: 'afterNoon',
            normal: {
                front: 'FrontlawnAfternoon.jpg',
                doorBorder: 'FrontlawnAfternoonDoor.png',
                door: 'FrontlawnAfternoonFloor.png',
            },
        },
        {
            key: 'night',
            normal: {
                front: 'FrontlawnNight.jpg',
                doorBorder: 'FrontlawnNightDoor.png',
                door: 'FrontlawnNightFloor.png',
            },
            cold: {
                front: 'FrontlawnNightCold.jpg',
                doorBorder: 'FrontlawnNightDoor.png',
                door: 'FrontlawnNightFloor.png',
            },
        },
        {
            key: 'nightDeep',
            normal: {
                front: 'FrontlawnNightDeep.jpg',
                doorBorder: 'FromtlawnNightDeepDoor.png',
                door: 'FromtlawnNightDeepFloor.png',
            },
        },
    ],
}
