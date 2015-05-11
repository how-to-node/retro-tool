// Mapping paths with routers
var routes = {
    '/': require('./main'),
    '/users': require('./users'),
    '/retros': require('./retros')
};

module.exports = function(app) {
    Object.keys(routes).forEach(function(path) {
        app.use(path, routes[path]);
    });
};
