require('dotenv').config()

const Q = require('q')
const express = require('express')
const mod = require('./module')
const mongoose = require('mongoose')
const { info, warning, error } = require('./modules/logger')
const bodyParser = require('body-parser')
const { url } = require('./modules/schema')
const schema = mod.schema

mongoose.set('strictQuery', true)

mongoose.connect(process.env.mongo, () => {
    info("Connected to DB")
})

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(async (req, res, next) => {
    const doc = await schema.url.findOne({ id: req.url.slice(1) })
    if (doc) {
        res.redirect(doc.url)
    } else {
        next()
    }
})

app.get('/', (req, res) => {
    res.send("Hello World!")
})

async function makeDeletionRequest(req, res, del, required) {
    if (!del && required) return mod.res.invalidKey(res);
    let token = del
    if (!mod.crypto.valid(token)) return mod.res.invalidKey(res);
    token = mod.crypto.decrypt(token)
    let id = token.split(" // ")[0]
    let urlto = token.split(" // ")[1]
    let created = token.split(" // ")[2]

    const schemaTable = { id: id, url: urlto, timeCreated: created }
    if (await schema.url.findOne(schemaTable)) {
        info("Deleted " + id)
        schema.url.findOneAndDelete(schemaTable).then(() => {
            mod.res.deleted(res)
        })
    } else {
        mod.res.noUrlFound(res)
    }
}

app.get('/url', (req, res) => {
    makeDeletionRequest(req, res, req.query.del || req.body.token, true)
})

app.delete('/url', (req, res) => {
    makeDeletionRequest(req, res, req.query.del || req.body.token, true)
})

app.post('/url', (req, res) => {
    if (!req.body.url) return mod.res.noUrlSpecified(res);
    const urlDefer = Q.defer()

    async function makeUrl() {
        var url = mod.generateString()
        if (await schema.url.findOne({ id: url })) {
            makeUrl()
        } else {
            urlDefer.resolve(url)
        }
    }
    makeUrl()

    urlDefer.promise.then((id) => {
        const url = new schema.url({
            timeCreated: new Date().toISOString(),
            id: id,
            url: req.body.url
        })
        url.save().then(() => {
            mod.res.created(res, id, req.body.url, url.timeCreated)
        })
    })
})

app.listen(3000, () => {
    console.clear()
    info("Server started.")
})