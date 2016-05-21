
(function(app) {
    'use strict';

    app.factory("iHttp", [ "$http", function($http) {
        return function(options) {
            return $http(options);
        }
    }]);

}(angular.module("ionic-ajax-interceptor")));