(function() {
    'use strict';

    angular.module('labmob.controllers')
        .controller('SearchCtrl', SearchCtrl);

    // ----------------------------------------------------------------------------------//
    /* @ngInject */
    SearchCtrl.$inject = ['$scope', '$http', '$ionicLoading', '$ionicPopup', '$q', 'WeatherServices'];

    function SearchCtrl($scope, $http, $ionicLoading, $ionicPopup, $q, WeatherServices) {

        var map, geolocation, marker, lastInfowindow, autocomplete;
        
        $ionicLoading.show({
            template: 'Loading...'
        });
        
        // $scope
        $scope.currentRadius = "1000";
        $scope.markers=[];
        $scope.city = "";
        $scope.longitude = 0.0;
        $scope.latitude = 0.0;
        $scope.distanceKm = 0.0;
        $scope.weather = "?";

        // Define Autocomplete for city field        
        if (google) {
            autocomplete = new google.maps.places.Autocomplete(
                document.getElementById('autocomplete'), {
                    types: ['geocode']
                });

            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                // Get the place details from the autocomplete object.
                var place = autocomplete.getPlace();
                if (place && place.geometry) {
                    $scope.city = place.name;
                    $scope.latitude = place.geometry.location.lat();
                    $scope.longitude = place.geometry.location.lng();
                    geolocation = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
                    placeMarker(geolocation, autocomplete); 
                    search($scope.longitude, $scope.latitude, map);
                    $scope.$apply();                    
                }        
                return;
            });


        }

        // Search Function
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

        // Locate action current device position 
        $scope.locate = function() {
            $scope.city = "";            
            $ionicLoading.show({
                template: 'Locating...'
            });
            if (navigator.geolocation) {
                // Start geolocation
                navigator.geolocation.getCurrentPosition(function(position) {
                    // Get Location and save result
                    geolocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    $scope.longitude = position.coords.longitude;
                    $scope.latitude = position.coords.latitude;
                    map = placeMarker(geolocation, autocomplete);
                    // Get location details
                    getDetailsFromLocation(geolocation)
                        .then(function(data) {
                            $scope.city = data;
                        }, function(reason) {
                            $scope.city = reason;
                        });
                    // Get weather
                    WeatherServices.getWeather(position.coords.latitude, position.coords.longitude)
                        .then(function(data) {
                            $scope.weather = data;
                        })
                    // Automatic search after locate
                    search($scope.longitude, $scope.latitude, map);
                    $ionicLoading.hide();
                });
            }
        };

        // ======================================================================================

        // Place point on map 
        function placeMarker(geolocation, autocomplete) {
            // Place marker
            var myOptions = {
                zoom: 14,
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
            map = new google.maps.Map(document.getElementById('map'), myOptions);

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

            // 
            google.maps.event.addListener(map, 'bounds_changed', function () {                
                //search($scope.longitude, $scope.latitude, map);
            });

            // Return the map
            return map;
        }

        // Get Details async
        function getDetailsFromLocation(geolocation) {
            var deferred = $q.defer();
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

   

        var search = function(longitude, latitude, map) {
            $ionicLoading.show({
                template: 'Searching...'
            });

            // Create request
            var request = {
                location: geolocation,
                radius: $scope.currentRadius,
                types: ["atm"],
                keyword:"hsbc",
                name:"hsbc"
            };
            // for search service
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, function(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                    }
                } else {
                    $ionicPopup.alert({
                        title: 'Recherche infructueuse',
                        template: "Aucun DAB HSBC à moins de "+ $scope.currentRadius + "m de votre position."
                    });
                }
            });

            // Create markers
            function createMarker(place) {
                var placeLoc = place.geometry.location;
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location,
                    //icon: "img/hsbc_marker_xs_010.png",
                    icon: "img/locationgrey_xs.png",
                    name: place.name,
                    animation: google.maps.Animation.DROP,
                    draggable:false,
                });
                $scope.markers.push(marker);

                // on Mouseover
                google.maps.event.addListener(marker, 'click', function() {
                    if (lastInfowindow) {
                        lastInfowindow.close();
                    };

                    lastInfowindow = new google.maps.InfoWindow({
                        content: "<strong>" + place.name + "</strong><br>" + place.vicinity
                    });
                    lastInfowindow.open(map, this);
                });
            }

            // Toggle bouncing marker
            function toggleBounceMarker() {
                  if (marker.getAnimation() != null) {
                    marker.setAnimation(null);
                  } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                  }
                }

            // Stop 
            $ionicLoading.hide();

        }

        $ionicLoading.hide();

    }
})();
