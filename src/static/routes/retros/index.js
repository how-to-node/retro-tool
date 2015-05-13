var express = require('express');
var path = require('path');
var router = express.Router();
var viewNamespace = 'retros'

// START: Routes
router.get('/', function(req, res, next) {
    res.redirect('/retros/create');
});

router.get('/create', function(req, res, next) {
    res.render(path.join(viewNamespace, 'create'), {});
});

router.get('/:room', function(req, res, next) {
    var room = req.params.room;

    // @todo Look for room - if not exists, render not-found
    res.render(path.join(viewNamespace, 'room'), {
        room: room
    });
});
// END: Routes

module.exports = router;
