const coap = require('coap')
const utils = require('./../utils/utils')

const port = 5683

coap.createServer((req, res) => {
    console.info(`CoAP device got a request for ${req.url}`)
    if (req.headers['Accept'] != 'application/json') {
        res.code = '4.06'   // CoAP-specific status code indicating the client requested an unsupported content type
        return res.end()
    }
    switch (req.url) {
        case "/co2":
            respond(res, {'co2': utils.randomInt(0, 1999)})
            break
        case "/temp":
            respond(res, {'temp': utils.randomInt(0, 40)})
            break
        default:
            respond(res)
    }
}).listen(port, () => {
    console.log(`CoAP server started on port ${port}`)
})

const respond = (res, content) => {
    if (content) {
        res.setOption('Content-Format', 'application/json')
        res.code = '2.05'   // Equivalent to HTTP 200 OK)
        res.end(JSON.stringify(content))
    } else {
        res.code = '4.04'
        res.end()
    }
}