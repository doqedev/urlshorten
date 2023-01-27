const url = "http://localhost:3000"
const crypto = require('./crypto')

const basic = (res, code, json) => {
    res.status(code).json(json)
}

module.exports.created = (res, id, urlto, createdDate) => {
    basic(res, 200, {
        success: true,
        message: "Created URL",
        generated: id,
        url: `${url}/${id}`,
        deleteUrl: url + "/url?del=" + crypto.encrypt(`${id} // ${urlto} // ${createdDate}`)
    })
}

module.exports.deleted = (res) => {
    basic(res, 200, {
        success: true,
        message: "Deleted URL",
    })
}

module.exports.noUrlFound = (res) => {
    basic(res, 404, {
        success: false,
        message: "No URL found.",
    })
}

module.exports.noUrlSpecified = (res) => {
    basic(res, 400, {
        success: false,
        message: "No URL specified.",
    })
}

module.exports.invalidKey = (res) => {
    basic(res, 401, {
        success: false,
        message: "Invalid key.",
    })
}