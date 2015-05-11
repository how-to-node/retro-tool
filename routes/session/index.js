var express = require('express');
var router = express.Router();

// START: Routes

// Login form
router.get('/', function(req, res) {
    res.render('login', {});
});

// Sign in action
router.post('/', function(req, res, next) {
    var guest = {
        user: req.body.username,
        password: req.body.password
    };
    req.session.guest = guest;
    res.redirect('/');
});
// END: Routes

module.exports = router;
