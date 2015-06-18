(function() {
    'use strict';

    angular
        .module('retroRoom')
        .directive('item', itemDirective);

    function itemDirective() {
        return {
            bindToController: true,
            controller: ItemController,
            controllerAs: 'ItemVm',
            restrict: 'E',
            templateUrl: '/js/retro-tool/spa/room/directives/item/item.html',
            scope: {
                item: '=data',
                isEditable: '=',
                retroStatus: '=status'
            }
        };
    }

    ItemController.$inject = ['RoomSocketClient', 'RetroConfig', '$scope'];

    function ItemController(RoomSocketClient, RetroConfig, $scope) {
        var vm = this;

        // actions
        vm.removeItem = removeItem;
        vm.voteItem = voteItem;
        vm.unvoteItem = unvoteItem;

        // setting up vm
        vm.isItemAuthor = vm.item.author === RetroConfig.username;
        determineIfVoted(vm.item.votes);

        // Every time votes list changes, we need to determine of current user has voted it
        $scope.$watch('ItemVm.item.votes', determineIfVoted);

        /**
         * Determines if current user is in the votes list
         * Add the result to vm.votedByUser {boolean}
         * @param {array} votes - list of votes
         */
        function determineIfVoted(votes) {
            if (votes) {
                vm.votedByUser = votes.indexOf(RetroConfig.username) > -1;
            }
        }

        /**
         * Emits a vote to the item
         */
        function voteItem() {
            console.log('Voting', vm.item);
            RoomSocketClient.emit('item:vote', vm.item.id);
        }

        /**
         * Emits an unvote to the item
         */
        function unvoteItem() {
            console.log('Unvoting', vm.item);
            RoomSocketClient.emit('item:unvote', vm.item.id);
        }

        /**
         * Emits to remove the item
         */
        function removeItem() {
            console.log('Removing', vm.item);
            RoomSocketClient.emit('item:remove', vm.item.id);
        }
    }
})();
