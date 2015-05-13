var express = require('express'),
    path = require('path'),
    router = express.Router();

// retros entry point - GET
router.get('/', function(req, res, next) {
    res.redirect('/retro/create');
});

// create a new retro - GET
router.get('/create', function(req, res, next) {
    res.render('create-retro', {});
});

// access a retro directly - GET
// query parameters:
//   - room: room number
router.get('/:room', function(req, res, next) {
    var room = req.params.room;

    // todo: Look for room - if not exists, render not-found
    res.render('room-retro', {
        room: room
    });
});
// END: Routes

module.exports = {
    router: router,
    path: '/retro'
};
