var sessionsManager = require('./manager');

function restrictToLoggedIn(req, res, next) {
    var user = sessionsManager.getUser(req.session.userKey);
    if (user !== null) {
        next();
    } else {
        res.render('login-main', {
            redirectTo: req.originalUrl
        });
    }
}

module.exports = {
    restrictToLoggedIn: restrictToLoggedIn
};
