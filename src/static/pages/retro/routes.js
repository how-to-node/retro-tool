var express = require('express'),
    path = require('path'),
    authorization = require('../../model/session/authorization'),
    router = express.Router();
console.log(authorization);
// retros entry point - GET
router.get('/', authorization.restrictToLoggedIn, function(req, res, next) {
    res.redirect('/retro/create');
});

// create a new retro - GET
router.get('/create', authorization.restrictToLoggedIn, function(req, res, next) {
    res.render('create-retro', {});
});

// access a retro directly - GET
// query parameters:
//   - room: room number
router.get('/:room', authorization.restrictToLoggedIn, function(req, res, next) {
    var room = req.params.room;

    // todo: Look for room - if not exists, render not-found
    res.render('room-retro', {
        room: room
    });
});

module.exports = {
    router: router,
    path: '/retro'
};
