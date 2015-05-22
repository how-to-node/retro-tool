(function() {
    'use strict';

    angular
        .module('retroRoom')
        .directive('retroRoom', retroRoomDirective);

    function retroRoomDirective(RoomSocketClient) {
        return {
            bindToController: true,
            controller: RetroRoomController,
            controllerAs: 'RetroRoomVm',
            restrict: 'E',
            templateUrl: '/js/retro-tool/spa/room/directives/retro-room/retro-room.html',
            scope: {}
        };
    }

    RetroRoomController.$inject = ['RoomSocketClient', 'RetroConfig'];

    function RetroRoomController(RoomSocketClient, RetroConfig) {
        var vm = this;

        // requesting retro data
        RoomSocketClient
            .join(RetroConfig.room)
            .then(loadRetroData, connectionRefused);

        function loadRetroData(room) {
            vm.roomName = room;
        }

        function connectionRefused(msg) {
            console.error('Connection refused:', msg);
        }
    }
})();
