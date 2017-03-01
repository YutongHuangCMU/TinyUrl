var mongoose = require("mongoose");
var schema = mongoose.Schema;

var urlSchema = new schema({
    shortUrl: String,
    longUrl: String,
    username: String,
    creationTime: Date
});

var urlModel = mongoose.model("urlModel", urlSchema);

module.exports = urlModel;