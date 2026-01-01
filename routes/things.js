const express = require('express')
const router = express.Router()
const resources = require('./../resources/model')

router.route('/coapDevice/sensors/:id').get( (req, res, next) => {
    const id = req.params.id
    req.result = resources.things.coapDevice.sensors[id]
    next()
})

module.exports = router