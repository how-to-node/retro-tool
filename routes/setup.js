var sessionsManager = require('../model/session/manager');

// Mapping paths with routers
var routes = {
    '/': require('./main'),
    '/login': require('./session'),
    '/retros': require('./retros')
};

module.exports = function(app) {
    // Making user available to all views
    app.use(function(req, res, next) {
        var user = null;
        if (req.session) {
            user = sessionsManager.getUser(req.session.userKey);
        }
        res.locals.user = user;
        next();
    });

    // Routes mapping
    Object.keys(routes).forEach(function(path) {
        app.use(path, routes[path]);
    });
};
