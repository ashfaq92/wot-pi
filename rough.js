const mqtt = require('mqtt')
require('dotenv').config()

// const config = require('./../')


const config = process.env.NODE_ENV


console.log('NODE_ENV:', config)
console.log('SERVER:', process.env.SERVER)
