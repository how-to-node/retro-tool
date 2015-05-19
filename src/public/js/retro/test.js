var retroSocket = io(window.location.origin + '/retro'),
    appElement = document.querySelector('.app'),
    room = appElement.attributes['data-room'].value;


retroSocket.emit('join:retro', room);
