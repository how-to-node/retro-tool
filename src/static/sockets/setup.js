var util = require('util');

module.exports = function webSocketsSetup(io) {
    io.on('connection', function clientConnected(socket) {
        socket.emit('connection-accepted');

        console.log('User ' + socket.id + ' has connected.');
        console.log('User ' + socket.request.session + ' has connected.');

        socket.on('message', function(msg) {
            console.log(msg);
            socket.emit('message', 'ok');
        });
    });
};
