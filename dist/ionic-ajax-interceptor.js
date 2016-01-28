
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
            stateChangeError: true
        };

        var _ajaxRequestsInQ = 0;

        return {
            config: function (options) {
                angular.extend(_config, options);

                $httpProvider.interceptors.push(function($rootScope) {
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
                            return err;
                        },
                        response: function(response) {
                            $rootScope.$broadcast('loading:hide');
                            return response;
                        },
                        responseError : function (err) {
                            $rootScope.$broadcast('loading:hide');
                            return err;
                        }
                    }
                })
            },
            $get: [
                '$ionicPopup',
                '$ionicLoading',
                '$rootScope',
                function($ionicPopup, $ionicLoading, $rootScope) {
                    /**
                     * Show loading modal
                     * @private
                     */
                    var _showLoading = function() {
                        $ionicLoading.show({
                            content: 'Loading',
                            animation: 'fade-in',
                            showBackdrop: true,
                            maxWidth: 200,
                            showDelay: 0
                        });
                    };
                    /**
                     * Hide loading modal
                     * @private
                     */
                    var _hideLoading = function() {
                        $ionicLoading.hide();
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
                                if (_ajaxRequestsInQ === 0 ) {
                                    _showLoading();
                                }
                                _ajaxRequestsInQ++;
                            });
                            //
                            // Listen for hide loading screen event
                            //
                            $rootScope.$on('loading:hide', function() {
                                if (_ajaxRequestsInQ > 0) {
                                    _hideLoading();
                                } else {
                                    // make sure _ajaxRequestsInQ doesn't go bellow 0
                                    _ajaxRequestsInQ = 1;
                                }
                                _ajaxRequestsInQ--;
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