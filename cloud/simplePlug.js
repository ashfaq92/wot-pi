const mqtt = require('mqtt')
require('./../env')


const thngId = process.env.thngId
const thngUrl = `/thngs/${thngId}`
const thngApiKey = process.env.thngApiKey
let interval

console.log(process.env)
console.log(`Using Thng # ${thngId} with API Key ${thngApiKey} to connect with ${process.env.MQTT_SERVER}`)


const client = mqtt.connect("mqtts://mqtt.evrythng.com:8883", {
    username: process.env.USER_NAME,
    password: thngApiKey
})

client.on('connect', () => {
    console.log('Connected to MQTT server')
    client.subscribe(`${thngUrl}/properties/`)
    updateProperty('livenow', true)
    interval = setInterval(updateProperties, 5000)
})

client.on('error', (err) => {
    console.log('MQTT Error:', err.message)
})

client.on('message', (topic, message) => {
    console.log('Received message on topic:', topic)
    console.log(message.toString())
})

const updateProperties = () => {
    const voltage = (219.5 + Math.random()).toFixed(3)
    updateProperty('voltage', voltage)

    const current = (Math.random() * 10).toFixed(3)
    updateProperty('current', current)

    const power = (voltage * current * (0.6 + Math.random()/10)).toFixed(3)
    updateProperty('power', power)
}

function updateProperty(property, value) {
    const propertyUrl = `${thngUrl}/properties/${property}`
    const valueObj = [{value: value}]
    console.log(`Publishing to ${propertyUrl}:`, JSON.stringify(valueObj))
    client.publish(propertyUrl, JSON.stringify(valueObj))
}

process.on("SIGINT", function() {
    clearInterval(interval)
    updateProperty('livenow', false)
    client.end()
    process.exit()
})

