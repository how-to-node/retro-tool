var express = require('express'),
    router = express.Router();

// retros entry point - GET
router.get('/', function(req, res, next) {
    res.redirect('/user/dashboard');
});

// create a new retro - GET
router.get('/dashboard', function(req, res, next) {
    res.render('dashboard-user', {});
});

// create a new retro - GET
router.get('/my-profile', function(req, res, next) {
    res.render('my-profile-user', {});
});

module.exports = {
    router: router,
    path: '/user'
};
