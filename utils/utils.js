const resources = require('./../resources/model');

exports.addDevice = (id, deviceName, description, sensors, actuators) => {
    if (!resources.things) {
        resources.things = {}
    }
    resources.things[id] = {
        'name': deviceName,
        'description': description,
        'sensors': sensors,
        'actuators': actuators
    }
}

exports.randomInt = (low, high) => {
    return Math.floor(Math.random() * (high - low + 1) + low)
};