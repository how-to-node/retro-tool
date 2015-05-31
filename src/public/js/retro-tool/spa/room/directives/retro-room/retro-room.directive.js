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

        RoomSocketClient.on('item:voted', updateVotes);
        RoomSocketClient.on('item:unvoted', updateVotes);

        function updateVotes(data) {
            var itemId = data.item,
                votes = data.votes,
                item = findItem(itemId);

            if (item) {
                item.votes = votes;
            }
        }

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

        function findItem(itemId) {
            var i,
                item = null,
                items = vm.room.items.positives.concat(vm.room.items.negatives);

            for (i = 0; i < items.length && !item; i++) {
                if (items[i].id === itemId) {
                    item = items[i];
                }
            }

            return item;
        }
    }
})();
