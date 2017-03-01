var app = angular.module("tinyUrlApp", ["ngRoute", "ngResource", "chart.js", 'ui.bootstrap']);

app.config(function($routeProvider) {
    console.log("enter app js");
    $routeProvider
        .when("/", {
            templateUrl: "./public/views/home.html",
            controller: "homeController"
        })
        .when("/urls/:shortUrl", {
            templateUrl: "./public/views/url.html",
            controller: "urlController"
        });
});