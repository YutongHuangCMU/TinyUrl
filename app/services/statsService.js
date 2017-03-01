var geoip = require("geoip-lite");
var RequestModel = require("../models/requestModel");

var redis = require("redis");
var host = process.env.REDIS_PORT_6379_TCP_ADDR;
var port = process.env.REDIS_PORT_6379_TCP_PORT;
var redisClient = redis.createClient(port, host);

var logRequest = function(shortUrl, req) {
    var logInfo = {};
    logInfo.shortUrl = shortUrl;
    logInfo.referer = req.headers.referer || "Unknown";
    logInfo.platform = req.useragent.platform || "Unknown";
    logInfo.browser = req.useragent.browser || "Unknown";
    var ip = req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    var geo = geoip.lookup(ip);
    if (geo) {
        logInfo.country = geo.country;
    } else {
        logInfo.country = "Unknown";
    }
    logInfo.timestamp = new Date();
    var request = new RequestModel(logInfo);
    request.save(function(err) {
        redisClient.publish(shortUrl, shortUrl);
    });
};

var getUrlInfo = function(shortUrl, info, callback) {
    if (info === "totalClicks") {
        RequestModel.count({shortUrl : shortUrl}, function(err, data) {
            callback(data);
        });
        return;
    }
    var groupId = "";
    if (info === "hour") {
        groupId = {
            year: { $year : "$timestamp" },
            month: { $month : "$timestamp"},
            day: { $dayOfMonth : "$timestamp"},
            hour: { $hour : "$timestamp"},
            minute: { $minute : "$timestamp"}
        }
    } else if (info === "day") {
        groupId = {
            year: { $year : "$timestamp" },
            month: { $month : "$timestamp"},
            day: { $dayOfMonth : "$timestamp"},
            hour: { $hour : "$timestamp"},
        }
    } else if (info === "month") {
        groupId = {
            year: { $year : "$timestamp" },
            month: { $month : "$timestamp"},
            day: { $dayOfMonth : "$timestamp"},
        }
    } else {
        groupId = "$" + info;
    }

    RequestModel.aggregate([
        {
            $match: {
                shortUrl: shortUrl
            }
        },
        {
            $sort: {
                timestamp: -1
            }

        },
        {
            $group: {
                _id: groupId,
                count: { $sum : 1 }
            }
        }
    ] , function(err, data) {
        callback(data);
    });
};

module.exports = {
    logRequest : logRequest,
    getUrlInfo : getUrlInfo
};
