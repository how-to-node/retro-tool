(function() {
    'use strict';

    angular
        .module('retroRoom', [])
        .constant('RETRO_STATUS_LABELS', {
            'adding-items': 'Adding Items',
            'voting': 'Voting',
            'adding-actions-to-take': 'Adding Actions to take',
            'closed': 'Closed'
        })
        .constant('RETRO_STATUS_CHAIN', {
            'adding-items': {
                transitionLabel: 'Start adding items!',
                next: 'voting',
                prev: null
            },
            'voting': {
                transitionLabel: 'Start voting!',
                next: 'adding-actions-to-take',
                prev: 'adding-items'
            },
            'adding-actions-to-take': {
                transitionLabel: 'Start adding actions-to-take!',
                next: 'closed',
                prev: 'voting'
            },
            'closed': {
                transitionLabel: 'Finish',
                next: null,
                prev: 'adding-actions-to-take'
            }
        });

})();
