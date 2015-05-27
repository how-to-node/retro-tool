var express = require('express'),
    path = require('path'),
    authorization = require('../../model/session/authorization'),
    sessionManager = require('../../model/session/manager'),
    retrosManager = require('../../model/retros/manager'),
    usersManager = require('../../model/users/manager'),
    retroHandler = require('./websocket/retro-handler'),
    router = express.Router();

// retros entry point - GET
router.get('/', authorization.restrictToLoggedIn, function(req, res, next) {
    res.redirect('/retro/create');
});

// create a new retro - GET
router.get('/create', authorization.restrictToLoggedIn, function(req, res, next) {
    res.render('create-retro', {
        usernames: usersManager.getAllUsernames()
    });
});

// create a new retro - POST
router.post('/create', authorization.restrictToLoggedIn, function(req, res, next) {
    var retroName = req.body.name,
        user = sessionManager.getLoggedUser(req.session);

    if (retrosManager.createRetro(retroName, user.username, req.body.participants)) {
        // go to room
        res.redirect('/retro/' + retroName);
    } else {
        // couldn't create retro
        res.render('create-retro', {
            usernames: usersManager.getAllUsernames(),
            error: {
                message: 'Retro name already taken'
            }
        });
    }
});

// access a retro directly - GET
// query parameters:
//   - room: room number
router.get('/:room', authorization.restrictToLoggedIn, function(req, res, next) {
    var room = req.params.room,
        user = sessionManager.getLoggedUser(req.session);

    if (!retrosManager.isActiveRetro(room) || !retrosManager.hasAccess(room, user.username)) {
        res.render('not-found-retro', {});
        return;
    }

    res.render('room-retro', {
        room: room,
        isOwner: retrosManager.isRetroOwner(room, user.username)
    });
});

module.exports = {
    router: router,
    path: '/retro',
    webSocketsMap: {
        retro: retroHandler
    }

};
