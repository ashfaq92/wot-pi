const resources = require('./../resources/model')
const rgbLed = require('../plugins/internal/rgbLedPlugin');

const model = resources.pi.sensors

let localParams = {
    "frequency": 3000,
}
let timer = null

exports.update = (params) => {
    localParams = params
    if (timer) clearInterval(timer)

    timer = setInterval(() => {
        const temp = model.temperature.value
        if (typeof temp !== 'number') {
            rgbLed.colors.OFF()
            return
        }
    
        const { r, g, b } = tempToColor(temp)
        rgbLed.setColor(r, g, b)
    }, localParams.frequency)
    console.info(`Temperature monitoring started (interval ${params.frequency}ms)`)
}

/* ---------------- TEMP → COLOR ---------------- */

const tempToColor = temp => {
    if (temp < -20) temp = -20
    if (temp > 40) temp = 40

    let r, g, b

    if (temp <= 0) {
        const ratio = (temp + 20) / 20
        r = 0
        g = Math.round(ratio * 255)
        b = 255
    } else if (temp <= 20) {
        const ratio = temp / 20
        r = Math.round(ratio * 255)
        g = 255
        b = Math.round(255 - ratio * 255)
    } else {
        const ratio = (temp - 20) / 20
        r = 255
        g = Math.round(255 - ratio * 255)
        b = 0
    }

    return { r, g, b }
}
