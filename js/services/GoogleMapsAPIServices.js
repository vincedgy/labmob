// firebaseServices.js

(function() {

    'user strict';
    angular
        .module('labmob.GoogleMapsAPISrvModule', [])
        .factory('GoogleMapsAPIServices', GoogleMapsAPIServices);

    GoogleMapsAPIServices.$inject = ['CONFIG', '$q'];

    function GoogleMapsAPIServices(CONFIG, $q) {
        var that = this;
        that.GoogleMapsAPIServices = null;
        
        var GoogleMapsAPIServices = {
            
        };
        return GoogleMapsAPIServices;
    };


})();
