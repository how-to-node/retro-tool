var express = require('express'),
    sessionsManager = require('../../model/session/manager');

var router = express.Router();


// START: Routes

// Login form
router.get('/', function(req, res) {
    res.render('login', {});
});

// Sign in action
router.post('/', function(req, res, next) {
    var userKey = sessionsManager.login(req.body.username, req.body.password);
    if (userKey) {
        req.session.userKey = userKey;
        res.redirect('/');
    } else {
        res.render('login', {
            error: {
                message: 'Try again'
            }
        });
    }

});
// END: Routes

module.exports = router;
