(function () {
    'use strict';

    angular
        .module('retroRoom')
        .directive('retroStatusToggle', retroStatusToggleDirective);

    function retroStatusToggleDirective() {
        return {
            bindToController: true,
            controller: retroStatusToggleController,
            controllerAs: 'RetroStatusToggleVm',
            restrict: 'E',
            templateUrl: '/js/retro-tool/spa/room/directives/retro-status-toggle/retro-status-toggle.html',
            scope: {
                currentStatus: '=',
                isOwner: '='
            }
        };
    }

    retroStatusToggleController.$inject = ['RoomSocketClient', 'RETRO_STATUS_CHAIN', 'RETRO_STATUS_LABELS', '$scope'];

    function retroStatusToggleController(RoomSocketClient, RETRO_STATUS_CHAIN, RETRO_STATUS_LABELS, $scope) {
        var vm = this;

        vm.goNext = goNext;
        vm.goPrev = goPrev;

        updateStatusData(vm.currentStatus);

        $scope.$watch('RetroStatusToggleVm.currentStatus', updateStatusData);

        RoomSocketClient.on('status:changed', function(newStatus) {
            vm.currentStatus = newStatus;
        });

        function updateStatusData(status) {
            var chain = RETRO_STATUS_CHAIN[status],
                label = RETRO_STATUS_LABELS[status],
                nextStatusChain = chain && RETRO_STATUS_CHAIN[chain.next];

            if (!chain || !label) {
                return;
            }

            vm.currentLabel = label;

            vm.nextLabel = nextStatusChain && nextStatusChain.transitionLabel;
            vm.prevLabel = RETRO_STATUS_LABELS[chain.prev];

            vm.isLast = chain.next === null;
            vm.isFirst = chain.prev === null;
        }

        function goNext() {
            RoomSocketClient.emit('status:next');
        }

        function goPrev() {
            RoomSocketClient.emit('status:prev');
        }
    }
})();
