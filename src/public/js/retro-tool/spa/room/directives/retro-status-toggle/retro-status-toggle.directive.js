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

        // actions
        vm.goNext = goNext;
        vm.goPrev = goPrev;

        updateStatusData(vm.currentStatus);

        // needs to update the status whenever it changes
        $scope.$watch('RetroStatusToggleVm.currentStatus', updateStatusData);


        RoomSocketClient.on('status:changed', function(newStatus) {
            vm.currentStatus = newStatus;
        });

        /**
         * Updates vm based on new status
         * @param {string} status - new status
         */
        function updateStatusData(status) {
            var chain = RETRO_STATUS_CHAIN[status], // contains info for next and prev status
                label = RETRO_STATUS_LABELS[status], // current status label
                nextStatusChain = chain && RETRO_STATUS_CHAIN[chain.next]; // contains info for the status following next

            if (!chain || !label) {
                return;
            }

            // labels
            vm.currentLabel = label;
            vm.nextLabel = nextStatusChain && nextStatusChain.transitionLabel;
            vm.prevLabel = RETRO_STATUS_LABELS[chain.prev];

            // flags
            vm.isLast = chain.next === null;
            vm.isFirst = chain.prev === null;
        }

        /**
         * Emits for moving to next status
         */
        function goNext() {
            RoomSocketClient.emit('status:next');
        }

        /**
         * Emits for moving to prev status
         */
        function goPrev() {
            RoomSocketClient.emit('status:prev');
        }
    }
})();
