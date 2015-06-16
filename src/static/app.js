var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),

    // Core modules
    path = require('path'),
    util = require('util'),

    // Middlewares
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    sioSession = require('express-socket.io-session'),

    // Own modules
    routerSetup = require('./pages/setup.routes.js');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || '3000',
    server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
    sessionInstance = session({
        secret: 'retro-tool',
        maxAge: 36000000,
        resave: true,
        saveUninitialized: false
    });

// Setting up Jade
app.set('view engine', 'jade');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('retro-tool'));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Session configuration
app.use(sessionInstance);
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});
io.use(sioSession(sessionInstance));

// Configuring routes
routerSetup(app, io, sessionInstance);

// Catch 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// Error handlers
if (app.get('env') === 'development') {
    // In development, show stack trace
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
} else {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });
}

server.listen(server_port, server_ip_address);

server.on('error', function(err) {
    console.error('There was an error');
    console.log(util.inspect(err));
});

server.on('listening', function() {
    console.log('Listening on ' + server_ip_address + ', server_port ' + server_port);
});
