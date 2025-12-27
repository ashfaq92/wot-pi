const { WebSocketServer } = require("ws")
const resources = require('./../resources/model')


exports.listen = server => {
    const wss = new WebSocketServer({server: server})
    console.info('WebSocket server started...')
    wss.on('connection', function (ws, request) {
        const url = request.url.replace(/\/$/, '')  // Remove trailing slash to match emit path

        let resource;
        try {
            resource = selectResource(url)
        } catch {
            ws.close()
            return
        }

        const handler = (updated) => {
            ws.send(JSON.stringify(updated))
        }

        resources.on(url, handler)

        ws.on('close', () => {
            resources.removeListener(url, handler)
        })
    })
}

const selectResource = url => {
    const parts = url.split('/').filter(p => p !== '')
    let result = resources
    for (let i=0; i < parts.length; i++) {
        result = result[parts[i]]
    }
    return result
}


