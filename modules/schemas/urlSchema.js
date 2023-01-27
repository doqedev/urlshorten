const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    url: String,
    id: String,
    timeCreated: String // the isodate when the url was created
})

module.exports = mongoose.model("Url", urlSchema)