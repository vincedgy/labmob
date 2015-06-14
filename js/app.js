// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
(function() {
    'use strict';

   
    // Module dependencies
    var labmodApp = angular.module('labmob', [
        'ionic'                       // Ionic
        ,'ngCordova'                  // ngCordova
        , 'labmob.controllers'        // Controllers
        , 'labmob.FirebaseSrvModule'  // Firebase services
        //, 'firebase'                  // Angulafire services
        , 'labmob.GoogleMapsAPISrvModule' // Google
        , 'labmob.WeatherServices'          // Weather services
        ]);

    // Application constants
    labmodApp.constant("CONFIG", {
        VERSION: "0.0.3",
        GOOGLE_API: "",
        FIREBASE_URL: "https://labmob.firebaseio.com/",
        WEATHER_URL: "http://api.openweathermap.org/data/2.5/weather"
    });

    // Application run event
    labmodApp.run(function($ionicPlatform, $timeout, $state) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            $timeout(function() {
                $state.go('app.search');
                }, 1000);
        });
    });

    // Application configuration for routings
    labmodApp.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        // Abstract global application routing
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })
            // Search routing
            .state('app.search', {
                url: "/search",
                views: {
                    'menuContent': {
                        templateUrl: "templates/search.html",
                        controller: 'SearchCtrl'
                    }
                }
            })
            // About routing
            .state('app.about', {
                url: "/about",
                views: {
                    'menuContent': {
                        templateUrl: "templates/about.html"
                    }
                }
            })
            // Help routing
            .state('app.help', {
                url: "/help",
                views: {
                    'menuContent': {
                        templateUrl: "templates/help.html"
                    }
                }
            })
            // Playlists routing
            .state('app.playlists', {
                url: "/playlists",
                views: {
                    'menuContent': {
                        templateUrl: "templates/playlists.html",
                        controller: 'PlaylistsCtrl'
                    }
                }
            })
            // Choosen Playlist routing
            .state('app.single', {
                url: "/playlists/:playlistId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/playlist.html",
                        controller: 'PlaylistCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/playlists');
    });

})();
