const httpServer = require('./servers/http')
const resources = require('./resources/model')

const rgbLed = require('./plugins/internal/rgbLedPlugin')
const weatherPlugin = require('./plugins/external/weatherPlugin')
// const pirPlugin = require('./plugins/internal/pirPlugin')
// // const dhtPlugin = require('./plugins/internal/DHT22SensorPlugin')

// // pirPlugin.start({ 'simulate': true, 'frequency': 5000 })
// dhtPlugin.start({ 'simulate': true, 'frequency': 5000 })


// Start LED plugin (simulation false, hardware mode)
rgbLed.start({ simulate: false })

// Start weather plugin (simulated or real, with desired frequency)
// weatherPlugin.start({ simulate: true, frequency: 2000 })

// Optional: Monitor weather and set LED based on temperature
// const tempMonitoring = require('./apps/temperatureMonitoring')
// tempMonitoring.update({frequency: 1000})

// Start HTTP server
const server = httpServer.listen(resources.pi.port, () => {
    console.info(`Behold! Your WoT Pi has awoken from its digital slumber on port ${resources.pi.port} 🐍💻`)
})
