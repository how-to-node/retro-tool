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

        // actions
        vm.addItem = addItem;

        // setting up vm
        vm.statusMsgs = RETRO_STATUS_LABELS;
        vm.loggedUsername = RetroConfig.username;
        vm.isOwner = RetroConfig.isOwner;

        // new item defaulted to 'positive'
        vm.newItem = {
            sign: 'positive'
        };

        // requesting retro data
        RoomSocketClient
            .join(RetroConfig.room)
            .then(loadRetroData, connectionRefused);

        // when someone adds an item
        RoomSocketClient.on('item:added', function(item) {
            if (item.sign === 'positive') {
                vm.room.items.positives.push(item);
            } else if (item.sign === 'negative') {
                vm.room.items.negatives.push(item);
            }
        });

        // when someone removes an item
        RoomSocketClient.on('item:removed', function(itemId) {
            // try to remove from positives first
            if (!removeIfFound(vm.room.items.positives, itemId)) {
                // if wasn't found in positives, try to remove from negatives
                removeIfFound(vm.room.items.negatives, itemId);
            }

            /**
             * Helper function to find and remove an item from the list
             * @param {array} itemsList - list of items
             * @param {string} itemId - item to remove
             * @return {boolean} true if elements was found and removed
             */
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

        // when someone votes an item
        // todo: Unify these two events in one only
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

        /*
         * Handler for successful connection to retro-room
         * @param {string} room
         */
        function loadRetroData(room) {
            vm.room = room;
        }

        /**
         * Handler for failed connection to rtro-room
         * @param {string} msg
         */
        function connectionRefused(msg) {
            console.error('Connection refused:', msg);
        }

        /**
         * Emits for adding an item
         * @param {object} item
         */
        function addItem(item) {
            console.log('INFO - Trying to add new item', item);
            // send message to the server
            RoomSocketClient.emit('item:add', item);
            // resets the new item model
            vm.newItem = {
                sign: 'positive'
            };
        }

        /**
         * Helper function to find an item
         * @param {string} itemId
         */
        function findItem(itemId) {
            var i,
                item = null,
                // puts all items in a same list
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
