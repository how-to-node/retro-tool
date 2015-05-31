var sessionManager = require('../../../model/session/manager'),
    retrosManager = require('../../../model/retros/manager');

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
            var newItem = room.addItem(newItem.description, newItem.sign, user.username);
            if (newItem) {
                console.log('Socket - INFO: Item added to %s by %s', roomName, user.username);
                ns.to(roomName).emit('item:added', newItem);
            }
        });

        clientSocket.on('item:remove', function(itemId) {
            var success = room.removeItem(itemId, user.username);
            if (success) {
                console.log('Socket - INFO: Item %d removed from %s by %s', itemId, roomName, user.username);
                ns.to(roomName).emit('item:removed', itemId);
            }
        });

        clientSocket.on('item:vote', function(itemId) {
            var newVoters = room.addVoter(user.username, itemId);
            console.log(newVoters);
            if (newVoters) {
                ns.to(roomName).emit('item:voted', {
                    item: itemId,
                    votes: newVoters
                });
            }
        });

        clientSocket.on('item:unvote', function(itemId) {
            var newVoters = room.removeVoter(user.username, itemId);
            if (newVoters) {
                ns.to(roomName).emit('item:unvoted', {
                    item: itemId,
                    votes: newVoters
                });
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

module.exports = retroWebSocketHandler;
