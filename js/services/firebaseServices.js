// firebaseServices.js

(function() {

    'user strict';
    angular
        .module('labmob.FirebaseSrvModule', [])
        .factory('FirebaseService', FirebaseService);

    FirebaseService.$inject = ['CONFIG', '$q'];

    function FirebaseService(CONFIG, $q) {
        var that = this;
        that.firebase = null;
        
        var FirebaseService = {
            // Singleton
            getFirebase: function() {
                if (that.firebase) {
                    return that.firebase;
                } else {
                    that.firebase = new Firebase(CONFIG.FIREBASE_URL);
                    return that.firebase;
                }
            },
            // Set function to send something 
            set: function(object) {
                var deferred = $q.defer();
                if (object) {
                    this.getFirebase().set(object, function(error) {
                        if (error) {
                            deferred.reject(error);
                        } else {
                            deferred.resolve(object);
                        }
                    });
                } else {
                    deferred.reject(object);
                }
                return deferred.promise;
            }
        }
        return FirebaseService;
    };


})();
