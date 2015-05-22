(function() {
    'use strict';

    angular
        .module('retroRoom')
        .factory('RoomSocketClient', RoomSocketClient);

    RoomSocketClient.$inject = ['$rootScope'];

    function RoomSocketClient($rootScope) {
        var socket = io(window.location.origin + '/retro');

        return {
            join: function(room, success, error) {
                if (room) {
                    this.emit('join:retro', room);
                    this.on('connection:accepted', success);
                    this.on('connection:refused', error);
                }
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
