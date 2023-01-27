
function generateRandomString() {
    let final = ""
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    let counter = 0;
    while (counter < 8) {
        final += alpha.charAt(Math.floor(Math.random() * alpha.length));
        counter += 1;
    }

    return final
}


module.exports.generateString = generateRandomString
module.exports.crypto = require('./modules/crypto')
module.exports.logger = require('./modules/logger')
module.exports.schema = require('./modules/schema')
module.exports.res = require('./modules/res')