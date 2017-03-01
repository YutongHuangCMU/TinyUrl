var express = require("express");
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var restRouter = require("./routes/rest");
var redirect = require("./routes/redirect");
var indexRouter = require("./routes/index");
var mongoose = require("mongoose");
var useragent = require("express-useragent");

var redis = require("redis");
var host = process.env.REDIS_PORT_6379_TCP_ADDR;
var port = process.env.REDIS_PORT_6379_TCP_PORT;
var redisClient = redis.createClient(port, host);

mongoose.connect("mongodb://xxx:xxx@xxx");

app.use(useragent.express());
app.use("/public", express.static(__dirname + "/public"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use("/", indexRouter);
app.use("/api/v1/", restRouter);
app.use("/:shortUrl", redirect);

server.listen(3000);

io.on("connection", function(socket) {
    console.log("io connection!!!!!!!!");
    socket.on("registerShortUrl", function (shortUrl) {
        redisClient.subscribe(shortUrl, function () {
            socket.shortUrl = shortUrl;
        });
        redisClient.on("message", function(channel, message) {
            if (message === socket.shortUrl) {
                socket.emit("shortUrlUpdated");
            }
        });
    });
    socket.on("disconnect", function() {
        if (socket.shortUrl == null) return;
        redisClient.unsubscribe(socket.shortUrl);
    });
});
