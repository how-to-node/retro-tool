var path = require('path'),
    fs = require('fs'),
    sioSession = require('express-socket.io-session'),
    sessionsManager = require('../model/session/manager');

var modules = getAvailableModules();

module.exports = function(app, io, session) {
    // mapping each module views
    app.set('views', modules.views);

    // making user available to all views
    app.use(function(req, res, next) {
        var user = null;
        if (req.session) {
            user = sessionsManager.getUser(req.session.userKey);
        }
        res.locals.user = user;
        next();
    });

    // routes mapping
    modules.routes.forEach(function(route) {
        // http
        app.use(route.path, route.router);

        // web socket
        if (route.webSocketsMap) {
            Object.keys(route.webSocketsMap).forEach(function(namespace) {
                connectionHandler = route.webSocketsMap[namespace];
                if (typeof namespace !== 'string' || typeof connectionHandler !== 'function') {
                    return;
                }
                var moduleNamespace = io.of('/' + namespace);
                moduleNamespace.use(sioSession(session));
                moduleNamespace.on('connection', function(socket) {
                    connectionHandler(socket, moduleNamespace);
                });
            });
        }
    });
};

// Looks for modules synchronously in the file system. Modules structure:
//   pages/
//     +-- moduleA/
//       + -- views/
//       + -- routes.js
//     +-- moduleB/
//       + -- views/
//       + -- routes.js
function getAvailableModules() {
    var files = fs.readdirSync(__dirname),
        modules = {
            routes: [],
            views: []
        };

    files.forEach(function(file) {
        var filePath = path.join(__dirname, file),
            routePath = path.join(filePath, 'routes.js'),
            viewsPath = path.join(filePath, 'views'),
            stat;

        stat = fs.statSync(filePath);

        if (stat.isDirectory()) { // is a module
            if (fs.existsSync(routePath)) { // routes.js file is required
                modules.routes.push(require(routePath));
                modules.views.push(viewsPath);
            }
        }
    });

    return modules;
}
