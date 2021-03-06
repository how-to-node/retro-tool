var express = require('express'),
    sessionsManager = require('../../model/session/manager'),
    retrosManager = require('../../model/retros/manager'),
    router = express.Router();

// home page - GET
router.get('/', function(req, res) {
    var user = sessionsManager.getLoggedUser(req.session);
    res.render('home-main', {
        myRetros: user ? retrosManager.getUserRetros(user.username) : null
    });
});

// login - GET
router.get('/login', function(req, res) {
    res.render('login-main', {});
});

// logout - GET
router.get('/log-out', function(req, res) {
    var userKey = req.session.userKey;
    if (userKey) {
        sessionsManager.logout(userKey);
    }
    res.redirect('/');
});

// sign-in handler - POST
// body:
//   - body.username: username - required
//   - body.password: user's password - required
router.post('/sign-in', function(req, res, next) {
    var userKey = sessionsManager.login(req.body.username, req.body.password),
        nextPage = req.body.redirectTo || '/';

    if (userKey) {
        req.session.userKey = userKey;
        res.redirect(nextPage);
    } else {
        // login failed
        res.render('login-main', {
            redirectTo: nextPage,
            error: {
                message: 'Try again'
            }
        });
    }
});

// unauthorized page - GET
router.get('/unauthorized', function(req, res) {
    res.render('unauthorized', {});
});

module.exports = {
    router: router,
    path: '/'
};
