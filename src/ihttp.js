
(function(app) {
    'use strict';

    var _prefix = "iHttp_";

    app.factory("iHttp", [ "$http", "$q", function($http, $q) {
        return function(options) {
            //
            // iCache format:
            // {
            //    key: String,
            //    expires: timestamp (null = never expire)
            // }
            //
            var key, expires;

            if (options.iCache) {
                //
                // Determine key
                //
                key = _prefix;
                expires = options.iCache.expires;

                if ( options.iCache.hasOwnProperty("key") ) {
                    key += options.iCache.key;
                } else {
                    key += options.url;
                }
                //
                // Does data exist?
                //
                var cacheData = localStorage.getItem(key);
                if (cacheData) {
                    var cacheObj = JSON.parse(cacheData);
                    //
                    // Is it valid?
                    //
                    if ( ! cacheObj.timestamp || cacheObj.timestamp > new Date().getTime() ) {
                        return $q.resolve({data: cacheObj.data});
                    }
                }
                //
                // Remove key
                //
                delete options.iCache;
            }
            var defer = $q.defer();

            $http(options).then(
                function success(res) {
                    //
                    // Not found, so cache data
                    //
                    if ( key ) {
                        var data = JSON.stringify({
                            timestamp: expires,
                            data: res.data
                        });
                        localStorage.setItem(key, data);
                    }
                    defer.resolve(res);
                },
                function error(err) {
                    defer.reject(err);
                }
            );

            return defer.promise;
        }
    }]);

}(angular.module("ionic-ajax-interceptor")));