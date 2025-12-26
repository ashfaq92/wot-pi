const resources = require('./../resources/model');

exports.addDevice = (id, name, description, sensors, actuators) => {
    if (!resources.things) {
        resources.things = {}
    }
    resources.things[id] = {
        'name': name,
        'description': description,
        'sensors': sensors,
        'actuators': actuators
    }
}

exports.randomInt = (low, high) => {
    return Math.floor(Math.random() * (high - low + 1) + low)
};