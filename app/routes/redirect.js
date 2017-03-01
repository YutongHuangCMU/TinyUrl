var express = require("express");
var router = express.Router();
var urlService = require("../services/urlService");
var path = require("path");
var statsService = require("../services/statsService");

router.get("*", function(req, res) {
    var shortUrl = req.originalUrl.slice(1);
    urlService.getLongUrl(shortUrl, function(url) {
        if (url) {
            res.redirect(url.longUrl);
            statsService.logRequest(shortUrl, req);
        } else {
            res.status(404).send("Page Not Found!");
        }
    });
});

module.exports = router;