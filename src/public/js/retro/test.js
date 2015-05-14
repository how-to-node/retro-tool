var retroSocket = io(window.location.origin + '/retro');

retroSocket.on('connection:accepted', function(msg) {
    console.log('Connection accepted!', msg);
});
