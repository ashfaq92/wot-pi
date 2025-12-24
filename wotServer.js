const httpServer = require('./servers/http')
const resources = require('./resources/model')

const server = httpServer.listen(resources.pi.port, function() {
    console.info(`Behold! Your WoT Pi has awoken from its digital slumber on port ${resources.pi.port} 🐍💻`)
})