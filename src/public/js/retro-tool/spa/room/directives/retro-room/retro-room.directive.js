(function() {
    'use strict';

    angular
        .module('retroRoom')
        .directive('retroRoom', retroRoomDirective);

    function retroRoomDirective() {
        return {
            bindToController: true,
            controller: RetroRoomController,
            controllerAs: 'RetroRoomVm',
            restrict: 'E',
            templateUrl: '/js/retro-tool/spa/room/directives/retro-room/retro-room.html',
            scope: {}
        };
    }

    RetroRoomController.$inject = ['RoomSocketClient', 'RetroConfig', 'RETRO_STATUS_LABELS'];

    function RetroRoomController(RoomSocketClient, RetroConfig, RETRO_STATUS_LABELS) {
        var vm = this;

        vm.statusMsgs = RETRO_STATUS_LABELS;
        vm.addItem = addItem;

        // requesting retro data
        RoomSocketClient
            .join(RetroConfig.room)
            .then(loadRetroData, connectionRefused);

        RoomSocketClient.on('item:added', function(item) {
            if (item.sign === 'positive') {
                vm.room.items.positives.push(item);
            } else if (item.sign === 'negative') {
                vm.room.items.negatives.push(item);
            }
            vm.room.items[item.sign].push(item);
        });

        function loadRetroData(room) {
            vm.room = room;
            console.log(room);
        }

        function connectionRefused(msg) {
            console.error('Connection refused:', msg);
        }

        function addItem(item) {
            console.log('INFO - Trying to add new item', item);
            RoomSocketClient.emit('item:add', item);
            vm.newItem = {};
        }
    }
})();
