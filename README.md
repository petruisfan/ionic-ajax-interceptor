# ionic-ajax-interceptor
Ajax interceptor for $http, designed for ionic.

This library is meant to make working with ajax calls much simpler.
It's functionalities include:
 - showing a loading screen during http requests
 - caching response data in local storage
 - adding authorization tokens to the request
 - transforming requests and responses
 - default error handler for ui-router
 - fallback ip for cases when dns is not working

## How to use:

1) Install it:

```shell
$ bower install ionic-ajax-interceptor --save
```

2) Add the js to your html:

```html
<script src="lib/ionic-ajax-interceptor/dist/ionic-ajax-interceptor.min.js"></script>
```

3) Configure your module:

```JavaScript
angular.module('app', ['ionic', 'ionic-ajax-interceptor'])
    .config(function( AjaxInterceptorProvider ) {
        AjaxInterceptorProvider.config({
            title: "Bummer",
            defaultMessage: "I crashed :(",
            transformRequest: function(data) {
                data.someKey = "Some value:";
                return data;
            }
        });
    }))
    .run(function (AjaxInterceptor) {
        AjaxInterceptor.run();
        ...
    })
```

4) Use it just like $http:

```JavaScript
var request = {
    method: 'GET',
    url: Constants.endpoint + "/json",
    iCache: {
        expires: new Date().getTime() + 1000 * 60 // in one minute
    }
};

AjaxService.http(request).then(
    function success(res) {
        ...
    },
    function error(err) {
        ...    
    }
);
```

Now every time you make a $http request, while the request is in progress, there will be a spinner in front:

![Example](/screenshots/loading.png?raw=true)

## Authorization token

$http requests can have an authorization header added to each request. just do a:

```JavaScript
AjaxInterceptor.setAuthorizationToken(<some token>);
```

and all the following request will have a header added automagically :)

## UI-router state change error

Every time a resolve fails in a state, a $ionicPopup confirm is shown. 
If the resolve failed and the error argument has a "message" key, it will be shown in alert body:

![Example](/screenshots/stateChangeError.png?raw=true)

## Available options:

| Key  | Type | Defaul | Why? |
| ---- | ---- | ------ | ---- |
| stateChangeError | boolean | true | Show a ionic alert every time a "resolve" value failed to return in angular-ui-router. | 
| title | string | Error | The title of the alert |
| defaultMessage | string | Unknown error | The body of the alert | 
| authorizationHeader | string | Authorization | key header to add | 
| authorizationToken | string | null | value of the header |
| fallbackIp | string | null | Add a fallback ip. For example if the server DNS is not resolved, try to access it by IP. |
| iCache | Object | null | Add caching capabilities |
| iCache.key | string | request url | The key under which to save the response |
| iCache.expires | timestamp | null | When should the cached data expire? Null = never |
| transformRequest | function | null | Function applied to transform request. Must return the data |
| transformResponse | function | null | Function applied to transform response. Must return the data |

## Methods

| Name | Arguments | Why? |
| ---- | --------- | ---- |
| config | options | Use it in a config block to configure available options mentioned above |
| run | - | Set the interceptors for $http requests. Call this in the run block before other $http calls |
| setAuthorizationToken | token | Add an 'authorization' header with token value |
| showLoading | - | Show the loading screen. Useful for long running tasks or other remote operations like connecting to bluetooth |
| hideLoading | - | Hide the loading screen |

## AjaxService

AjaxService is a service that can be used the same way as $http, but has the added cache functionality.
It has 3 methods:
- http: replacement for $http
- clearCache
- config

