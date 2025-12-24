const httpServer = require('./servers/http')
const resources = require('./resources/model')

const server = httpServer.listen(resources.pi.port, function() {
    console.info(`Your WoT Pi is up and running on port ${resources.pi.port}`)
})