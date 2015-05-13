var socket = io.connect(window.location.origin);
socket.on('connection-accepted', function() {
    console.log('Connection accepted!!!');
});
