(function() {
    'use strict';

    angular.module('labmob.controllers')
        .controller('PlaylistCtrl', PlaylistCtrl);

    // ----------------------------------------------------------------------------------//
    /* @ngInject */
    PlaylistCtrl.$inject = ['$scope', '$stateParams'];
    function PlaylistCtrl($scope, $stateParams) {
        var myFirebaseRef = new Firebase("https://labmob.firebaseio.com/");
        $scope.playlist = $stateParams.playlistId;
        myFirebaseRef.child("location/city").on("value", function(snapshot) {
            $scope.playlist = $stateParams.playlistId + ":" + snapshot.val();
        });

    };

})();
