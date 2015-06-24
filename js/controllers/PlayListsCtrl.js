(function() {
    'use strict';
    angular.module('labmob.controllers')
        .controller('PlaylistsCtrl', PlaylistsCtrl);

    // ----------------------------------------------------------------------------------//
    /* @ngInject */
    PlaylistsCtrl.$inject = ['$scope','FirebaseService'];
    function PlaylistsCtrl($scope, FirebaseService) {
        $scope.playlists = [
            {title: 'Ma banque en ligne', id: 1 },
            {title: 'Mon mobile', id: 2 },
            {title: 'Mes nombreux avantages', id: 3 },
            {title: 'Mon patrimoine', id: 4 }, 
            {title: 'Ma succession', id: 5 },
            {title: 'Mon Assitance', id: 6 }
            ];

        var object = {
            title: "Hello Country !",
            author: "Firebase",
            location: {
                city: "Paris",
                state: "California",
                zip: 94103
            },
            collection : $scope.playlists
        };

        FirebaseService.set(object)
            .then(
                // Success
                function(object) {
                    $scope.message = "Fine";
                    return;
                },
                // Error
                function(reason) {
                    $scope.message = "Error !";
                    return;
                }
            );
    };

})();
