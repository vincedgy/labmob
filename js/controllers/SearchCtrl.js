(function() {
    'use strict';

    angular.module('labmob.controllers')
        .controller('SearchCtrl', SearchCtrl);

    // ----------------------------------------------------------------------------------//
    /* @ngInject */
    SearchCtrl.$inject = ['$scope', '$http', '$ionicLoading', '$ionicPopup', '$q', 'WeatherServices'];

    function SearchCtrl($scope, $http, $ionicLoading, $ionicPopup, $q, WeatherServices) {

        var map, geolocation, marker, point2;

        // TEST define PARIS point
        point2 = new google.maps.LatLng(48.52, 2.19); // Paris

        // $scope
        $scope.city = "";
        $scope.longitude = 0.0;
        $scope.latitude = 0.0;
        $scope.distanceKm = 0.0;
        $scope.weather = "?";

        // Autocomplete for city field        
        var autocomplete = new google.maps.places.Autocomplete(
            document.getElementById('autocomplete'), {
                types: ['geocode']
            });

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            // Get the place details from the autocomplete object.
            var place = autocomplete.getPlace();
            $scope.city = place.name;
            $scope.latitude = place.geometry.location.lat();
            $scope.longitude = place.geometry.location.lng();
            geolocation = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
            placeMarker(geolocation,autocomplete)
            
        });

        $scope.search = function() {
            if (map && $scope.city && $scope.city !== "") {
                search($scope.longitude, $scope.latitude, map);
            } else {
                $ionicPopup.alert({
                    title: 'Oops !',
                    template: 'Il manque la ville ? Essayez la localistation !'
                });
            }
        };

        // Place point on map 
        function placeMarker(geolocation, autocomplete) {
            // Place marker
            var myOptions = {
                zoom: 15,
                center: geolocation,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: [{
                    stylers: [{
                        visibility: 'simplified'
                    }]
                }, {
                    elementType: 'labels',
                    stylers: [{
                        visibility: 'off'
                    }]
                }]
            };
            var map = new google.maps.Map(document.getElementById('map'), myOptions);

            marker = new google.maps.Marker({
                position: geolocation,
                map: map,
                title: 'Votre position',
                icon: {
                    // Star
                    path: 'M 0,-24 6,-7 24,-7 10,4 15,21 0,11 -15,21 -10,4 -24,-7 -6,-7 z',
                    fillColor: '#ffff00',
                    fillOpacity: 1,
                    scale: 1 / 4,
                    strokeColor: '#bd8d2c',
                    strokeWeight: 1
                }
            });

            // Precision for geolocation
            /*
            var circle = new google.maps.Circle({
                center: marker.position,
                radius: geolocation.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
            */

            // Return the map
            return map;
        }

        // Get Details async
        function getDetailsFromLocation(geolocation) {
            var deferred=$q.defer();            
            var geocoder = new google.maps.Geocoder();
                geocoder.geocode({
                    'latLng': geolocation
                },
                function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            deferred.resolve(results[1].formatted_address);                            
                        } else {
                            deferred.reject('No result');
                        }
                    } else {
                        deferred.reject('No geocoder');
                    }
                });
            return deferred.promise;
        }

        // Locate current device position 
        $scope.locate = function() {
            $ionicLoading.show({
                template: 'Locating...'
            });
            if (navigator.geolocation) {
                // Start geolocation
                navigator.geolocation.getCurrentPosition(function(position) {
                    // Save result
                    geolocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    $scope.longitude = position.coords.longitude;
                    $scope.latitude = position.coords.latitude;
                    map = placeMarker(geolocation, autocomplete);
                    getDetailsFromLocation(geolocation)
                        .then(function(data){
                            $scope.city = data;
                        }, function(reason){
                            $scope.city = reason;
                        });
                    WeatherServices.getWeather(position.coords.latitude, position.coords.longitude)
                        .then(function(data) {
                            $scope.weather = data;
                        })
                });
            }
            $ionicLoading.hide();
        };

        var search = function(longitude, latitude, map) {
            $ionicLoading.show({
                template: 'Searching...'
            });

            // Create request
            var request = {
                location: geolocation,
                radius: 500,
                types: ['hsbc']
            };
            // for search service
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, function(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                    }
                }
            });
            // Create markers
            function createMarker(place) {
                var placeLoc = place.geometry.location;
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.setContent(place.name);
                    infowindow.open(map, this);
                });
            }


            // Calcul de la distance entre Paris (point1) et New York (point2)
            var distanceKm = google.maps.geometry.spherical.computeDistanceBetween(marker, point2);
            $scope.distanceKm = Math.round(distanceKm / 1000);

            // Stop 
            $ionicLoading.hide();

        }

    }
})();
