var colors = require('colors/safe');
colors.enable()

module.exports.info = (msg) => {
    console.log(colors.green(`[INFO] ${msg}`))
}

module.exports.warning = (msg) => {
    console.log(colors.yellow(`[WARNING] ${msg}`))
}

module.exports.error = (msg) => {
    console.log(colors.red(`[ERROR] ${msg}`))
}
