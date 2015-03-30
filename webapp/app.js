'use strict';

// JavaScript Documentvar
var app = angular.module('ECMSapp', [
	'ngRoute',
	'ngAnimate',
	'ECMSapp.login',
	'ECMSapp.home',
	'ECMSapp.mainMenu',
    'ECMSapp.services',
	'ECMSapp.adminMain',
	'ECMSapp.assignCM',
    'ECMSapp.intakeDistribution',
	'kendo.directives'
	])

// BALLU /////////////////////////////////////////////////////////////////////////////////////////

app.factory("StorageService", function($window, $rootScope) {

    return {
        setToken: function(val) {
            $window.localStorage && $window.localStorage.setItem('token', val);
            return this;
        },
        getToken: function() {
            return $window.localStorage && $window.localStorage.getItem('token');
        }
    };
});

app.factory("ConfigService", function($window, $rootScope) {
    return {
        setRestURI: function(val) {
            $window.localStorage && $window.localStorage.setItem('resturl', val);
            return this;
        },
        getRestURI: function() {
            return $window.localStorage && $window.localStorage.getItem('resturl');
        },
        initializeApp : function(){
            $rootScope.loggedIn = false;
        }
    };
});

app.factory('httpRequestInterceptor', function (StorageService, ConfigService) {
    return {
        request: function (config) {
        	//console.log("Inside interceptor:" )
        	//console.log(config);
            config.headers['X-Auth-Token'] = StorageService.getToken();
            if (config.url.indexOf('.html') === -1){
                config.url = ConfigService.getRestURI() + config.url ;
            }
            return config;
        }
    };
});

app.factory('loginService', function( $http){
    return{
        login:function(credentials){

            Object.toparams = function ObjecttoParams(obj) {
                var p = [];
                for (var key in obj) {
                    p.push(key + '=' + encodeURIComponent(obj[key]));
                }
                return p.join('&');
            };

            var restservice = "/rest/auth/login";
            var data = Object.toparams(credentials);

            return $http({
                method: 'POST',
                url: restservice,
                data: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        logout : function(){
            var restservice = "/rest/auth/logout";
            return $http.get(restservice);
        }
    }
})


app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
});



app.run( function($location, $window, ConfigService, StorageService){
    //ConfigService.setRestURI("http://localhost:8080/");
    ConfigService.initializeApp();
    //ConfigService.setRestURI("http://cc-devapp1.ncmecad.net:8080/ecms-staging");
	ConfigService.setRestURI("http://cc-devapp1.ncmecad.net:8080/ecms-services.nightly");
    StorageService.setToken(null);

    var windowElement = angular.element($window);
    windowElement.on('beforeunload', function (event) {
        // do whatever you want in here before the page unloads.
        
        // the following line of code will prevent reload or navigating away.
        if (StorageService.getToken() === 'null' && $location.path() !== "/login" ) {
			//console.log( " Browser prevented from refreshing/accessing directly a partial page: " + $location.path() );
            event.preventDefault();
        }
    })

});