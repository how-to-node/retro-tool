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

        vm.removeItem = removeItem;
        vm.voteItem = voteItem;
        vm.unvoteItem = unvoteItem;

        vm.isItemAuthor = vm.item.author === RetroConfig.username;
        determineIfVoted(vm.item.votes);

        $scope.$watch('ItemVm.item.votes', determineIfVoted);

        function determineIfVoted(votes) {
            if (votes) {
                vm.votedByUser = votes.indexOf(RetroConfig.username) > -1;
            }
        }

        function voteItem() {
            console.log('Voting', vm.item);
            RoomSocketClient.emit('item:vote', vm.item.id);
        }

        function unvoteItem() {
            console.log('Unvoting', vm.item);
            RoomSocketClient.emit('item:unvote', vm.item.id);
        }

        function removeItem() {
            console.log('Removing', vm.item);
            RoomSocketClient.emit('item:remove', vm.item.id);
        }
    }
})();
