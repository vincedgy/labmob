(function() {
    'use strict';

    angular.module('labmob.controllers')
        .controller('PlaylistCtrl', PlaylistCtrl);

    // ----------------------------------------------------------------------------------//
    /* @ngInject */
    PlaylistCtrl.$inject = ['$stateParams','FirebaseService'];
    function PlaylistCtrl($stateParams, FirebaseService) {
        var vm = this;
        var myFirebaseRef = new Firebase("https://labmob.firebaseio.com/");
        vm.playlist = $stateParams.playlistId;
        FirebaseService.get().child("location/city").on("value", function(snapshot) {
            vm.playlist = $stateParams.playlistId + ":" + snapshot.val();
        });

    };

})();
