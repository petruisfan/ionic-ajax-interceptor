
(function() {
    'use strict';

    angular.module("ionic-ajax-interceptor", ['ionic']);

}());

(function(app) {
    'use strict';

    app.provider("AjaxInterceptor", ["$httpProvider", function($httpProvider) {

        var _config = {
            title: "Error",
            defaultMessage: "Unknown error",
            authorizationHeader: "Authorization",
            authorizationToken: null,
            stateChangeError: true,
            fallbackIp: null,

            transformRequest: null,
            transformResponse: null
        };

        return {
            config: function (options) {
                angular.extend(_config, options);

                $httpProvider.interceptors.push(["$rootScope", "$q", "$injector", function($rootScope, $q, $injector) {
                    return {
                        request: function(req) {
                            $rootScope.$broadcast('loading:show');

                            if ( _config.authorizationToken ) {
                                req.headers[ _config.authorizationHeader ] = _config.authorizationToken;
                            }

                            return req;
                        },
                        requestError: function(err) {
                            $rootScope.$broadcast('loading:hide');
                            return $q.reject(err);
                        },
                        response: function(response) {
                            $rootScope.$broadcast('loading:hide');
                            return response;
                        },
                        responseError : function (err) {
                            //console.log(res);
                            if (err.status == 0) {
                                var aux = err.config.url.split("/");
                                //
                                // Retry once more with fallback ip
                                //
                                if (aux[2] !== _config.fallbackIp) {
                                    aux[2] = _config.fallbackIp;
                                    err.config.url = aux.join("/");

                                    var $http = $injector.get('$http');
                                    return $http(err.config);
                                }
                            }
                            $rootScope.$broadcast('loading:hide');
                            return $q.reject(err);
                        }
                    }
                }]);
                //
                // User configurable transformers
                //
                if (_config.transformRequest) {
                    $httpProvider.defaults.transformRequest.push(_config.transformRequest);
                }
                if (_config.transformResponse) {
                    $httpProvider.defaults.transformResponse.push(_config.transformResponse);
                }
            },
            $get: [
                '$ionicPopup',
                '$ionicLoading',
                '$rootScope',
                '$http',
                function($ionicPopup, $ionicLoading, $rootScope, $http) {

                    var _ajaxRequestsInQ = 0;

                    /**
                     * Show loading modal
                     * @private
                     */
                    var _showLoading = function() {
                        if (_ajaxRequestsInQ === 0 ) {
                            $ionicLoading.show({
                                content: 'Loading',
                                animation: 'fade-in',
                                showBackdrop: true,
                                maxWidth: 200,
                                showDelay: 0
                            });
                        }
                        _ajaxRequestsInQ++;
                    };
                    /**
                     * Hide loading modal
                     * @private
                     */
                    var _hideLoading = function() {
                        _ajaxRequestsInQ--;

                        if ( _ajaxRequestsInQ == 0 ) {
                            $ionicLoading.hide();
                        } else if ( _ajaxRequestsInQ < 0 ) {
                            // make sure _ajaxRequestsInQ doesn't go bellow 0
                            _ajaxRequestsInQ = 0;
                        }
                    };

                    return {
                        /**
                         * Set up listeners
                         */
                        run: function() {
                            if ( _config.stateChangeError ) {
                                //
                                // Listen for resolved errors in ui-view
                                //
                                $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                                    $ionicPopup.alert({
                                        title: _config.title,
                                        content: error.message || _config.defaultMessage
                                    });
                                });
                            }
                            //
                            // Listen for show loading screen event
                            //
                            $rootScope.$on('loading:show', function() {
                                _showLoading();
                            });
                            //
                            // Listen for hide loading screen event
                            //
                            $rootScope.$on('loading:hide', function() {
                                _hideLoading();
                            });
                        },
                        /**
                         *
                         * @param token
                         */
                        setAuthorizationToken: function(token) {
                            _config.authorizationToken = token;
                        },
                        /**
                         *
                         */
                        showLoading: function() {
                            _showLoading();
                        },
                        /**
                         *
                         */
                        hideLoading: function() {
                            _hideLoading();
                        }
                    };
                }]
        };
    }]);

}(angular.module("ionic-ajax-interceptor")));

(function(app) {
    'use strict';

    var _prefix = "iHttp_";

    app.factory("AjaxService", [ "$http", "$q", function($http, $q) {
        return {
            config: function(options) {
                if ( options.hasOwnProperty(prefix) ) { _prefix = options.prefix }
            },
            http: function (options) {
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

                    if (options.iCache.hasOwnProperty("key")) {
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
                        if (!cacheObj.timestamp || cacheObj.timestamp > new Date().getTime()) {
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
                        if ( key && res.data ) {
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
            },

            clearCache: function() {
                for (var key in localStorage ) {
                    if ( localStorage.hasOwnProperty(key) && key.indexOf(_prefix) == 0) {
                        localStorage.removeItem(key);
                    }
                }
            }
        };
    }]);

}(angular.module("ionic-ajax-interceptor")));