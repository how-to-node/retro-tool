var express = require('express'),
    path = require('path'),
    authorization = require('../../model/session/authorization'),
    sessionManager = require('../../model/session/manager'),
    retrosManager = require('../../model/retros/manager'),
    router = express.Router();

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

// handles socket connections to /retro namespace
function retroWebSocketHandler(client, ns) {
    client.on('join:retro', function(room) {
        var userKey = client.handshake.session && client.handshake.session.userKey,
            user = sessionManager.getUser(userKey);

        if (!user || !retrosManager.hasAccess(room, user.username) || !retrosManager.isActiveRetro(room)) {
            return;
        }

        setupSocket(client, room, user);
    });

    function setupSocket(clientSocket, room, user) {
        clientSocket.join(room);

        clientSocket.emit('connection:accepted', room);
        clientSocket.broadcast.to(room).emit('user:joined', user.username);
    }
}

module.exports = {
    router: router,
    path: '/retro',
    webSocketsMap: {
        retro: retroWebSocketHandler
    }

};
