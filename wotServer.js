const httpServer = require('./servers/http')
const wsServer = require('./servers/websockets')
const resources = require('./resources/model')

const rgbLed = require('./plugins/internal/rgbLedPlugin')
const weatherPlugin = require('./plugins/external/weatherPlugin')
// const pirPlugin = require('./plugins/internal/pirPlugin')
// // const dhtPlugin = require('./plugins/internal/DHT22SensorPlugin')

// // pirPlugin.start({ 'simulate': true, 'frequency': 5000 })
// dhtPlugin.start({ 'simulate': true, 'frequency': 5000 })


// Start LED plugin (simulation false, hardware mode)
rgbLed.start({ simulate: true })

// Start weather plugin (simulated or real, with desired frequency)
// weatherPlugin.start({ simulate: true, frequency: 2000 })

// Optional: Monitor weather and set LED based on temperature
// const tempMonitoring = require('./apps/temperatureMonitoring')
// tempMonitoring.update({frequency: 1000})


// External Plugins
// const coapPlugin = require('./plugins/external/coapPlugin');
// coapPlugin.start({ 'simulate': false, 'frequency': 10000 });
// const coapPlugin = require('./plugins/external/coapPlugin')
// coapPlugin.start({'simulate': true, 'frequency':1000})

// Start HTTP server
const server = httpServer.listen(resources.pi.port, () => {
    console.info(`HTTP server started on port: ${resources.pi.port}`)
    wsServer.listen(server)
    console.info(`Your WoT Pi is up and running on port ${resources.pi.port}`)
})
