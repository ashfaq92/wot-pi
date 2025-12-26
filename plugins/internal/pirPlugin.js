const resources = require('./../../resources/model')

let interval
let sensor

const model = resources.pi.sensors.pir
const pluginName = model.name
let localParams = {"simulate": false, "frequency": 5000}

exports.start = params => {
    localParams = params
    if (localParams.simulate) {
        simulate()
    } else {
        connectHardware()
    }
}

exports.stop = () => {
    if (localParams.simulate) {
        clearInterval(interval)
    } else {
        sensor.unexport()
    }
    console.info(`${pluginName} plugin stopped!`)
}

const simulate = () => {
    interval = setInterval(() => {
        model.value = !model.value
        showValue()
    }, localParams.frequency)
    console.info(`Simulated ${pluginName} started!`)
}

const showValue = () => {
    console.info(model.value ? 'Presence Detected!' : '')
}