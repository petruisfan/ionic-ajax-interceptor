# ionic-ajax-interceptor
Ajax interceptor for $http, designed for ionic

Well, theoretically you could just do this: http://learn.ionicframework.com/formulas/loading-screen-with-interceptors/
But that means copy-pasting some code in your project every time you want to show a loading modal over your app while
some ajax call loads. And plus, what happens when you have multiple ajax calls in the same time?

This provider is meant to make working with ajax calls much simpler. 

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
            defaultMessage: "I crashed :("
        });
    }))
    .run(function (AjaxInterceptor) {
        AjaxInterceptor.run();
        ...
    })
```

Now every time you make a $http request, while the request is in progress, there will be a spinner in front:

![Example](/screenshots/loading.png?raw=true)

## Authorization token

$http requests can have an authorization header added to each request. just do a:

```JavaScript
AjaxInterceptor.setAuthorizationToken(<some token>);
```

and all the following request will have a header added automagically :)

## Available options:

| Key  | Type | Defaul | Why? |
| ---- | ---- | ------ | ---- |
| stateChangeError | boolean | true | Show a ionic alert every time a "resolve" value failed to return in angular-ui-router. If the resolve failed and the first argument has a "message" key, it will be shown in alert body.  | 
| title | string | Error | The title of the alert |
| defaultMessage | string | Unknown error | The body of the alert | 
| authorizationHeader | string | Authorization | key header to add | 
| authorizationToken | string | null | value of the header | 

## Methods

| Name | Arguments | Why? |
| ---- | --------- | ---- |
| config | options | Use it in a config block to configure available options mentioned above |
| run | - | Set the interceptors for $http requests. Call this in the run block before other $http calls |
| setAuthorizationToken | token | Add an 'authorization' header with token value |
| showLoading | - | Show the loading screen. Useful for long running tasks or other remote operations like connecting to bluetooth |
| hideLoading | - | Hide the loading screen |

