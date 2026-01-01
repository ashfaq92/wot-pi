const utils = require('./../../utils/utils')
const resources = require('../../resources/model')

const coap = require('coap')
const bl = require('bl')


let interval, me, pluginName, pollInterval
let localParams = {
    'simulate': false, 
    'frequency': 5000
}

const connectHardware = ()  => {
    const sensor = {
        read: () => {
            coap.request({
                host: 'localhost',
                port: 5683,
                pathname: '/co2',
                options: {'Accept': 'application/json'}
            }).on('response', res => {
                console.info(`CoAP response code ${res.code}`)
                if (res.code !== '2.05') {
                    console.error(`Error while contacting CoAP service ${res.code}`)
                    res.pipe(bl( (err, data) => {
                        const json = JSON.parse(data)
                        me.value = json.co2  // check me
                        showValue()
                    }))
                }
            }).end()
        }
    }
    pollInterval = setInterval(() => {
        sensor.read()
    }, localParams.frequency)
}

const configure = () => {
    utils.addDevice(
        id='coapDevice', 
        deviceName='A CoAP Device', 
        description='A CoAP Device',
        sensors={
            'co2': {
                'name': 'CO2 Sensor',
                'description': 'An ambient CO2 sensor',
                'unit': 'ppm',
                'value': 0
            }
        }
    )
    me = resources.things.coapDevice.sensors.co2
    pluginName = resources.things.coapDevice.name
}



exports.start = (params, app) => {
    localParams = params
    configure(app)

    if (params.simulate) {
        simulate()
    } else {
        connectHardware()
    }
}

exports.stop = function () {
    if (params.simulate) {
        clearInterval(interval)
    } else {
        clearInterval(pollInterval)
    }
    console.info(`'${pluginName} plugin stopped!`)
}

function simulate() {
    interval = setInterval(function () {
        me.value = utils.randomInt(0, 1000);
        showValue();
    }, localParams.frequency)
    console.info(`Simulated ${pluginName} sensor started!`)
}

function showValue() {
    console.info(`CO2 Level: ${me.value} ppm`)
}