/* global google */
(function() {
    'use strict';

    angular.module('labmob.controllers')
        .controller('SearchCtrl', SearchCtrl);

    // ----------------------------------------------------------------------------------//
    /* @ngInject */
    SearchCtrl.$inject = ['CONFIG', '$ionicBackdrop','$timeout', '$ionicLoading', '$ionicPopup', '$q', 'WeatherServices'];

    function SearchCtrl(CONFIG, $ionicBackdrop, $timeout, $ionicLoading, $ionicPopup, $q, WeatherServices) {
        var vm = this;
        var map, geolocation, marker, lastInfowindow, autocomplete;
        var markers=[];
        
        // $scope
        vm.currentRadius = "1000";
        vm.city = "";
        vm.longitude = 0.0;
        vm.latitude = 0.0;
        vm.distanceKm = 0.0;
        vm.weather = "?";

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
                    vm.city = place.name;
                    vm.latitude = place.geometry.location.lat();
                    vm.longitude = place.geometry.location.lng();
                    geolocation = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
                    placeMarker(geolocation, autocomplete); 
                    search(vm.longitude, vm.latitude, map);
                    vm.$apply();                    
                }        
                return;
            });
        };

        // Search Function
        vm.search = function() {
            if (map && vm.city && vm.city !== "") {
                search(vm.longitude, vm.latitude, map);
            } else {
                $ionicPopup.alert({
                    title: 'Oops !',
                    template: 'Il manque la ville ? Essayez la localistation !'
                });
            }
        };

        // Locate action current device position 
        vm.locate = function() {
            vm.city = "";   
            // Start overlay         
            $ionicLoading.show({
                template: 'Locating...'
            });
            if (navigator.geolocation) {
                // Start geolocation
                
                $ionicBackdrop.retain();
                
                var timer = $timeout(
                    navigator.geolocation.getCurrentPosition(function(position) {
                        // Get Location and save result
                        geolocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        vm.longitude = position.coords.longitude;
                        vm.latitude = position.coords.latitude;
                        map = placeMarker(geolocation, autocomplete);
                        // Get location details
                        getDetailsFromLocation(geolocation)
                            .then(function(data) {
                                vm.city = data;
                            }, function(reason) {
                                vm.city = reason;
                            });
                        // Get weather
                        WeatherServices.getWeather(position.coords.latitude, position.coords.longitude)
                            .then(function(data) {
                                vm.weather = data;
                            }, function(reason) {
                                 vm.weather = "n/a";
                            });
                        
                        // Automatic search after locate
                        search(vm.longitude, vm.latitude, map);
                        
                        // Stop overlay
                        $ionicLoading.hide();
                        $ionicBackdrop.release();
                        
                        return;
                    }), 
                    CONFIG.TIMEOUT, false);                    
                    
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
                //search(vm.longitude, vm.latitude, map);
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
                radius: vm.currentRadius,
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
                        template: "Aucun DAB HSBC à moins de "+ vm.currentRadius + "m de votre position."
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
                markers.push(marker);

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
        };

        $ionicLoading.hide();

    }
})();
