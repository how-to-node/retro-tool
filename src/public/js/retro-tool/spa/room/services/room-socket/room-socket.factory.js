(function() {
    'use strict';

    angular
        .module('retroRoom')
        .factory('RoomSocketClient', RoomSocketClient);

    RoomSocketClient.$inject = ['$rootScope', '$q'];

    function RoomSocketClient($rootScope, $q) {
        var socket = io(window.location.origin + '/retro');

        return {
            join: function(room) {
                var deferred = $q.defer();

                if (room) {
                    this.emit('join:retro', room);
                    this.on('connection:accepted', function(data) {
                        deferred.resolve(data);
                    });
                    this.on('connection:refused', function(data) {
                        deferred.reject(data);
                    });
                }

                return deferred.promise;
            },
            on: function(event, handler) {
                socket.on(event, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        handler.apply(socket, args);
                    });
                });
            },
            emit: function(event, data) {
                socket.emit(event, data);
            }
        };
    }
})();
