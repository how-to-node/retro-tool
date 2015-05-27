var express = require('express'),
    path = require('path'),
    authorization = require('../../model/session/authorization'),
    sessionManager = require('../../model/session/manager'),
    retrosManager = require('../../model/retros/manager'),
    usersManager = require('../../model/users/manager'),
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

// handles socket connections to /retro namespace
function retroWebSocketHandler(client, ns) {

    // when any client tries to connect a room
    client.on('join:retro', function(room) {
        var user = sessionManager.getLoggedUser(client.handshake.session);

        console.log('Socket - INFO: ' + user.username + ' trying to join ' + room);

        if (!user || !retrosManager.hasAccess(room, user.username) || !retrosManager.isActiveRetro(room)) {
            client.emit('connection:refused', 'Not allowed');
            return;
        }

        setupSocket(client, room, user, ns);
    });

    // relating client with retro room
    function setupSocket(clientSocket, roomName, user, ns) {
        var room = retrosManager.getRetro(roomName);

        clientSocket.join(roomName);

        // notifying guest joined
        console.log('Socket - INFO: User %s has joined %s', user.username, roomName);
        clientSocket.emit('connection:accepted', room);
        ns.to(roomName).emit('user:joined', user.username);

        // start: retro room events
        clientSocket.on('item:add', function(newItem) {
            var success = room.addItem(newItem.description, newItem.sign, user.username);
            if (success) {
                console.log('Socket - INFO: Item added to %s by %s', roomName, user.username);
                ns.to(roomName).emit('item:added', newItem);
            }
        });
        // end: retro room events

        clientSocket.on('disconnect', function() {
            console.log('Socket - INFO: %s left %s', user.username, roomName);
            ns.to(roomName).emit('user:left', user.username);
            room = null;
        });
    }
}

module.exports = {
    router: router,
    path: '/retro',
    webSocketsMap: {
        retro: retroWebSocketHandler
    }

};
