const mqtt = require('mqtt')
require('./../env')

const thngId = process.env.thngId
const thngUrl = `/thngs/${thngId}`
const thngApiKey = process.env.thngApiKey


let status = false
let updateInterval

const client = mqtt.connect(process.env.MQTT_SERVER, {
    username: 'authorization',
    password: thngApiKey
})

client.on('connect', function () {
    client.subscribe(thngUrl + '/properties/')
    client.subscribe(thngUrl + '/actions/all') // Subscribe to all actions on this thing

    updateProperty('livenow', true)
    if (!updateInterval) updateInterval = setInterval(updateProperties, 5000)
})

client.on('message', function (topic, message) {
    var resources = topic.split('/')
    if (resources[1] && resources[1] === "thngs") { // Verify if the MQTT message is on a Thng
        if (resources[2] && resources[2] === thngId) {  // Verify if the message is for the current Thng
            if (resources[3] && resources[3] === "properties") { //Check if a property was changed if so display it
                var property = JSON.parse(message)
                console.log('Property was updated: ' + property[0].key + '=' + property[0].value)
            } else if (resources[3] && resources[3] === "actions") { // Was it an action? If so call handleAction()
                var action = JSON.parse(message)
                handleAction(action)
            }
        }
    }
})

function handleAction(action) {
    switch (action.type) { // Check the type of this action
        case '_setStatus':
            console.log('ACTION: _setStatus changed to: ' + action.customFields.status) // If action type is _setStatus, display the new value and do something with it
            status = Boolean(action.customFields.status)
            updateProperty('status', status)
            /* Do something else too */
            break
        case '_setLevel':
            console.log('ACTION: _setLevel changed to: ' + action.customFields.level)
            break
        default:
            console.log('ACTION: Unknown action type: ' + action.type)
            break
    }
}


function updateProperties() {
    var voltage = (219.5 + Math.random()).toFixed(3) // #H
    updateProperty('voltage', voltage)

    var current = (Math.random() * 10).toFixed(3) // #I
    if (status == false) current = 0.001
    updateProperty('current', current)

    var power = (voltage * current * (0.6 + Math.random() / 10)).toFixed(3) // #J
    updateProperty('power', power)
}

function updateProperty(property, value) {
    client.publish(thngUrl + '/properties/' + property, '[{"value": ' + value + '}]')
}

process.on('SIGINT', function () {
    updateProperty('livenow', false)
    clearInterval(updateInterval)
    client.end()
    process.exit()
})