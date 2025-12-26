const express = require('express')
const actuatorsRoutes = require('./../routes/actuators')
const sensorsRoutes = require('./../routes/sensors')
const resources = require('./../resources/model')
const cors = require('cors')
const converter = require('./../middleware/converter')

const app = express()
app.use(cors())


app.use('/pi/actuators', actuatorsRoutes)
app.use('/pi/sensors', sensorsRoutes)

app.get('/pi', function(req, res,) {
    res.send('This is the WoT-Pi!')
})

app.get('/', function (req, res,) {
    res.send('Index Page of the app')
})

app.use(converter())

module.exports = app