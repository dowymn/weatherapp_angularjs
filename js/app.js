'use strict'

var app = angular.module("weatherApp", ["ngRoute"]);

app.config(function($routeProvider) {

    $routeProvider
        .when("/", {
            templateUrl: "partials/meteovilles.html",
            controller: "meteovillesCtrl"
        })
        .when("/villes", {
            templateUrl: "partials/villes.html"
        })
        .when("/previsions/:id", {
            templateUrl: "partials/previsions.html",
            controller: "previsionsCtrl"
        })
        .otherwise({
            redirectTo: '/'
        });
});