var express = require('express'),
    sessionsManager = require('../../model/session/manager'),
    router = express.Router();

// home page - GET
router.get('/', function(req, res) {
    res.render('home-main', { title: 'Home' });
});

// login - GET
router.get('/login', function(req, res) {
    res.render('login-main', {});
});

// sign-in handler - POST
// body:
//   - body.username: username - required
//   - body.password: user's password - required
router.post('/sign-in', function(req, res, next) {
    var userKey = sessionsManager.login(req.body.username, req.body.password);
    if (userKey) {
        req.session.userKey = userKey;
        res.redirect('/');
    } else {
        // login failed
        res.render('login-main', {
            error: {
                message: 'Try again'
            }
        });
    }

});

module.exports = {
    router: router,
    path: '/'
};
