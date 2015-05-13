var sessionsManager = require('./manager');

function restrictToLoggedIn(req, res, next) {
    var user = sessionsManager.getUser(req.session.userKey);
    if (user !== null) {
        next();
    } else {
        res.redirect('/unauthorized');
    }
}

module.exports = {
    restrictToLoggedIn: restrictToLoggedIn
};
