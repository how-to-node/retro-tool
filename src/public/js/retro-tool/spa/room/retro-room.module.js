(function() {
    'use strict';

    angular
        .module('retroRoom', [])
        .constant('RETRO_STATUS_LABELS', {
            'adding-items': 'Adding Items',
            'voting': 'Voting',
            'adding-actions-to-take': 'Adding Actions to take',
            'closed': 'Closed'
        });

})();
