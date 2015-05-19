var retroSocket = io(window.location.origin + '/retro'),
    appElement = document.querySelector('.app'),
    room = appElement.attributes['data-room'].value;


retroSocket.emit('join:retro', room);

retroSocket.on('connection:accepted', function(room) {
    console.log('Successfully joined ' + room);
});

retroSocket.on('user:joined', function(who) {
    console.log(who, 'joined');
});
