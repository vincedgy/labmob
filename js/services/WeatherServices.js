// firebaseServices.js

(function() {

    'user strict';
    angular
        .module('labmob.WeatherServices', [])
        .factory('WeatherServices', WeatherServices);

    // ----------------------------------------------------------------------------------//
    /* @ngInject */
    WeatherServices.$inject = ['CONFIG', '$http', '$log', '$q'];

    function WeatherServices(CONFIG, $http, $log, $q) {
        var that = this;
        that.WeatherServices = null;

        var WeatherServices = {
            //city: "",
            //mainWeater: "",
            getWeather: function(latitute, longitute) {
                var deferred = $q.defer();
                $http
                    .get(CONFIG.WEATHER_URL + "?lat=" + latitute + "&lon=" + longitute)
                    .success(function(data) {
                        //city = data.name;
                        //mainWeater = data.weather[0].main;
                        deferred.resolve(data.weather[0].main);
                    })
                    .error(function(msg, code) {
                        deferred.reject(msg);
                        $log.error(msg, code);
                    })
                return deferred.promise;
            }
        };
        return WeatherServices;
    };


})();
