const msgpack = require('msgpack5')()
const json2html = require('node-json2html')

const encode = msgpack.encode

const converterMdlware = () => {
    return (req, res, next) => {
        console.info('Representation converter middleware called!')

        if (req.result) {
            if (req.accepts('json')) {
                console.info('JSON representation selected!')
                res.send(req.result)
                return
            }


       if (req.accepts('html')) {
    console.info('HTML representation selected!')
    const template = { "<>": "div", "html": "${name} : ${value}" }
    // Prepare data as an array
    let data
    if (Array.isArray(req.result)) {
        data = req.result
    } else if (typeof req.result === 'object' && req.result !== null) {
        // Convert object values to array and extract name/value properties
        data = Object.values(req.result)
            .filter(item => typeof item === 'object' && item.name && item.value !== undefined)
            .map(sensor => ({
                name: sensor.name,
                value: sensor.value
            }))
    } else {
        // Fallback: wrap in array if not already
        data = [req.result]
    }
    res.send(json2html.render(data, template))
    return
}

            if (req.accepts('application/x-msgpack')) {
                console.info('Messagepack representation selected!')
                res.type('application/x-msgpack')
                res.send(encode(req.result))
                return
            }

            console.info('defaulting to JSON representation!')
            res.send(req.result)
            return
        } else {
            next()
        }

    }
}

module.exports = converterMdlware