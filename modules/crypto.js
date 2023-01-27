const crypto = require('crypto')
const defaultPass = process.env.pass
const defaultSalt = process.env.salt
const algo = "aes-192-cbc"

const encrypt = (str, pass, salt) => {
    pass = pass || defaultPass
    salt = salt || defaultSalt

    let key = crypto.scryptSync(pass, salt, 24)
    let iv = Buffer.alloc(16);
    let cipher = crypto.createCipheriv(algo, key, iv)
    let eid = cipher.update(str, 'utf8', 'hex')
    eid += cipher.final('hex')
    return eid
}
const decrypt = (str, pass, salt) => {
    pass = pass || defaultPass
    salt = salt || defaultSalt

    let key = crypto.scryptSync(pass, salt, 24)
    let iv = Buffer.alloc(16);
    let deci = crypto.createDecipheriv(algo, key, iv)
    let decr = deci.update(str, 'hex', 'utf8')
    decr += deci.final();
    return decr
}
const valid = (str, pass, salt) => {
    pass = pass || defaultPass
    salt = salt || defaultSalt

    let v = false
    try {
        decrypt(str, pass, salt)
        v = true
    } catch (err) {

    }
    return v
}

module.exports = {
    valid: valid,
    encrypt: encrypt,
    decrypt: decrypt
}