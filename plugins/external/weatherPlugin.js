const utils = require('../../utils/utils')
const resources = require('./../../resources/model')

let timer = null
const model = resources.pi.sensors
let localParams = { 
    "simulate": false, 
    "frequency": 5000, 
    "city": "Jyväskylä"
}
const pluginName = 'Weather'

exports.start = params => {
    if (timer) {
        clearTimeout(timer)
        timer = null
    }
    localParams = params
    if (localParams.simulate) {
        simulate()
    } else {
        runWeather()
    }
}

exports.stop = () => {
    if (timer) {
        clearTimeout(timer)
        timer = null
    } 
    console.info(`${pluginName} plugin stopped!`)
}

const simulate = () => {
    timer = setTimeout(function tick() {
        model.temperature.value = utils.randomInt(-20, 40)
        model.humidity.value = utils.randomInt(0, 100)
        showValue()
        timer = setTimeout(tick, localParams.frequency)
    }, localParams.frequency)
    console.info(`Simulated ${pluginName} sensor started!`)
}


const runWeather = async () => {
    try {      
        await getWeather()          
    } finally {
        timer = setTimeout(runWeather, localParams.frequency)
    } 
}

const getWeather = async () => {
    try {
        const response = await fetch(`https://wttr.in/${localParams.city}?format=j1`);
        const data = await response.json();
        model.temperature.value = parseFloat(data.current_condition[0].temp_C);
        model.humidity.value = parseFloat(data.current_condition[0].humidity);
        showValue()
    } catch (err) {
        console.error('Error fetching weather:', err)
    }
    
}


const showValue = () => {
    console.info(`Temperature: ${model.temperature.value} C, humidity ${model.humidity.value} %`)
}



