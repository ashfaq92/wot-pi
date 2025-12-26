const resources = require('./../../resources/model')
const utils = require('./../../utils/utils')

let interval
let sensor
const model = resources.pi.sensors
const pluginName = 'Temperature & Humidity'
let localParams = { 'simulate': false, 'frequency': 5000 }



exports.start = params => {
    localParams = params
    if (localParams.simulate) {
        simulate()
    } else {
        connectHardware()
    }
};

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
        model.temperature.value = utils.randomInt(-20, 40)
        model.humidity.value = utils.randomInt(0, 100)
        showValue()
    }, localParams.frequency)
    console.info(`Simulated ${pluginName} sensor started!`)
}

const showValue = () => {
    console.info(`Temperature: ${model.temperature.value} C, humidity ${model.humidity.value} %`)
}

