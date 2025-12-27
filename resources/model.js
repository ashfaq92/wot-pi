// const resources = require('./resources.json')
// module.exports = resources



const EventEmitter = require('events')
const resources = require('./resources.json')

class Model extends EventEmitter {
    constructor(data) {
        super()
        this.data = data
    }

    get pi() {
        return this.data.pi
    }

    setLedValue(value) {
        this.data.pi.actuators.led.value = value
        this.emit('led:changed', value)
        this.emit('/pi/actuators/led', value)
    }
}

module.exports = new Model(resources)
