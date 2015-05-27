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
        vm.loggedUsername = RetroConfig.username;

        vm.addItem = addItem;
        vm.removeItem = removeItem;

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
        });

        RoomSocketClient.on('item:removed', function(itemId) {
            if (!removeIfFound(vm.room.items.positives, itemId)) {
                removeIfFound(vm.room.items.negatives, itemId);
            }

            function removeIfFound(itemsList, itemId) {
                var foundIndex = -1;

                for (var i = 0; i < itemsList.length && foundIndex === -1; i++) {
                    if (itemsList[i].id === itemId) {
                        foundIndex = i;
                    }
                }

                if (foundIndex > -1) {
                    console.log('Item %d has been removed', itemId);
                    itemsList.splice(foundIndex, 1);
                    return true;
                }

                return false;
            }
        });

        function loadRetroData(room) {
            vm.room = room;
        }

        function connectionRefused(msg) {
            console.error('Connection refused:', msg);
        }

        function addItem(item) {
            console.log('INFO - Trying to add new item', item);
            RoomSocketClient.emit('item:add', item);
            vm.newItem = {};
        }

        function removeItem(item) {
            console.log('Removing', item);
            RoomSocketClient.emit('item:remove', item.id);
        }
    }
})();
