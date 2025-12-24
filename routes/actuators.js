//Initial version:

const express = require('express')
const router = express.Router()
const resources = require('./../resources/model')

router.route('/').get(function (req, res, next) { // #A
    res.send(resources.pi.actuators); // #B
});

router.route('/leds').get(function (req, res, next) { // #C
    res.send(resources.pi.actuators.leds);
});

router.route('/leds/:id').get(function (req, res, next) { //#D
    res.send(resources.pi.actuators.leds[req.params.id]); //#E
});

module.exports = router;

