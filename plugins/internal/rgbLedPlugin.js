const model = require('./../../resources/model')

const rgbLedModel = model.pi.actuators.led

let spi = null
let simulate = false

const SPI_SPEED = 6400000
const pluginName = rgbLedModel.name

exports.start = params => {
    simulate = !!params?.simulate
    if (!simulate) {
        connectHardware()
    }

    model.on('led:changed', value => {
        exports.setColor(value.r, value.g, value.b)
    })

    console.info('%s plugin started (%s)', pluginName, simulate ? 'simulated' : 'hardware')
}

exports.stop = () => {
    if (spi) {
        writeColor(0, 0, 0)
        spi.closeSync()
        spi = null
    }
    console.info('%s plugin stopped', pluginName)
}

exports.setColor = (r, g, b) => {
    if (simulate) {
        console.info('LED → R=%d G=%d B=%d', r, g, b)
        return
    }

    if (!spi) {
        console.warn('LED hardware not connected')
        return
    }

    writeColor(r, g, b)
    rgbLedModel.value = { r, g, b }

}

exports.off = () => exports.setColor(0, 0, 0)

/* ---------------- HARDWARE ---------------- */

function connectHardware() {
    try {
        const SPI = require('spi-device')
        spi = SPI.openSync(0, 0)
        writeColor(0, 0, 0)
        console.info('%s hardware connected', pluginName)
    } catch (err) {
        console.error('Failed to init %s:', pluginName, err.message)
        spi = null
    }
}

function writeColor(r, g, b) {
    const buffer = colorToSPI(r, g, b)

    spi.transferSync([{
        sendBuffer: buffer,
        byteLength: buffer.length,
        speedHz: SPI_SPEED
    }])
}

/* ---------------- WS2812 ---------------- */

function colorToSPI(r, g, b) {
    const buffer = Buffer.alloc(24)
    // const colors = [g, r, b] // GRB (fixed comment mismatch)
    const colors = [r, g, b] // GRB (fixed comment mismatch)
    let pos = 0

    for (const color of colors) {
        for (let bit = 7; bit >= 0; bit--) {
            buffer[pos++] =
                (color & (1 << bit)) ? 0b11111100 : 0b11000000
        }
    }

    return buffer
}

/* ---------------- PRESETS ---------------- */

exports.colors = {
    RED: () => exports.setColor(255, 0, 0),
    GREEN: () => exports.setColor(0, 255, 0),
    BLUE: () => exports.setColor(0, 0, 255),
    OFF: () => exports.off()
}
