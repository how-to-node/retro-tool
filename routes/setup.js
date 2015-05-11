// Mapping paths with routers
var routes = {
    '/': require('./main'),
    '/login': require('./session'),
    '/retros': require('./retros')
};

module.exports = function(app) {
    Object.keys(routes).forEach(function(path) {
        app.use(path, routes[path]);
    });
};
