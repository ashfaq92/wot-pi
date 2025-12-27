//Initial version:

const express = require('express')
const router = express.Router()
const model = require('./../resources/model')

router.route('/').get(function (req, res, next) { // #A
    req.result = model.pi.actuators
    next()
});

router.route('/led').get(function (req, res, next) { // #C
    req.result = model.pi.actuators.led
    next()
})

router.route('/led/value').get(function (req, res, next) { // #C
    req.result = model.pi.actuators.led.value
    next()
}).put((req, res, next) => {
    model.setLedValue(req.body.value)
    console.info(`Changed LED ${model.pi.actuators.led.name} value to`, model.pi.actuators.led.value)

    req.result = model.pi.actuators.led
    next()
})

// router.route('/leds/:id').get(function (req, res, next) { //#D
//     res.send(resources.pi.actuators.leds[req.params.id]); //#E
// });

module.exports = router;

