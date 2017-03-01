angular.module("tinyUrlApp")
    .controller("urlController", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams) {

        var socket = io.connect();

        $http.get("/api/v1/urls/" + $routeParams.shortUrl)
            .success(function(data) {
                $scope.shortUrl = data.shortUrl;
                $scope.longUrl = data.longUrl;
                $scope.shortUrlToShow = "http://localhost/" + data.shortUrl;
                socket.emit("registerShortUrl", $scope.shortUrl);
            });

        function getTotalClicks() {
            $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/totalClicks")
                .success(function (data) {
                    $scope.totalClicks = data;
                });
        }

        getTotalClicks();

        $scope.getTime = function(info) {
            $scope["lineData"] = [];
            $scope["lineLabels"] = [];
            $scope.time = info;
            $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + info)
                .success(function(data) {
                    console.log("success getTime");
                    data.forEach(function(item) {
                        var legend = "";
                        if (info === "hour") {
                            if (item._id.minute < 10) {
                                item._id.minute = "0" + item._id.minute;
                            }
                            legend = item._id.hour + ":" + item._id.minute;
                        } else if (info === "day") {
                            legend = item._id.hour + ":" + "00";
                        } else if (info === "month") {
                            legend = item._id.month + "/" + item._id.day;
                        }
                        $scope["lineData"].push(item.count);
                        $scope["lineLabels"].push(legend);
                    });
                });
        };

        $scope.getTime("hour");

        var renderChart = function(chart, infos) {
            $scope[chart + "Data"] = [];
            $scope[chart + "Labels"] = [];
            $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + infos)
                .success(function(data) {
                    data.forEach(function(info) {
                        $scope[chart + "Data"].push(info.count);
                        $scope[chart + "Labels"].push(info._id);
                    });
                });
        };

        renderChart("doughnut", "referer");
        renderChart("pie", "country");
        renderChart("base", "platform");
        renderChart("bar", "browser");

        socket.on("shortUrlUpdated", function() {
            getTotalClicks();
            $scope.getTime($scope.time);
            renderChart("doughnut", "referer");
            renderChart("pie", "country");
            renderChart("base", "platform");
            renderChart("bar", "browser");
        })
    }]);
