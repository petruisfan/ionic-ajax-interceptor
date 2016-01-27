
(function(app) {
    'use strict';

    app.provider("AjaxInterceptor", ["$httpProvider", function($httpProvider) {

        var _config = {
            title: "Error",
            defaultMessage: "Unknown error"
        };

        return {
            config: function () {

                //angular.extend(_config, options);

                $httpProvider.interceptors.push(function($rootScope) {
                    return {
                        request: function(config) {
                            $rootScope.$broadcast('loading:show');
                            return config;
                        },
                        response: function(response) {
                            $rootScope.$broadcast('loading:hide');
                            return response;
                        }
                    }
                })
            },
            $get: ['$ionicPopup', '$ionicLoading', '$rootScope', function($ionicPopup, $ionicLoading, $rootScope) {
                return {
                    run: function() {
                        //
                        // Listen for resolved errors in ui-view
                        //
                        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
                            $ionicPopup.alert({
                                title: _config.title,
                                content: error.message || _config.defaultMessage
                            });
                        });

                        $rootScope.$on('loading:show', function() {
                            $ionicLoading.show({
                                content: 'Loading',
                                animation: 'fade-in',
                                showBackdrop: true,
                                maxWidth: 200,
                                showDelay: 0
                            })
                        });

                        $rootScope.$on('loading:hide', function() {
                            $ionicLoading.hide()
                        });
                    }
                };
            }]
        };
    }]);

}(angular.module("ionic-ajax-interceptor")));