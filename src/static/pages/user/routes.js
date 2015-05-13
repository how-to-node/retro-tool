var express = require('express'),
    authorization = require('../../model/session/authorization'),
    router = express.Router();

// retros entry point - GET
router.get('/', authorization.restrictToLoggedIn, function(req, res, next) {
    res.redirect('/user/dashboard');
});

// create a new retro - GET
router.get('/dashboard', authorization.restrictToLoggedIn, function(req, res, next) {
    res.render('dashboard-user', {});
});

// create a new retro - GET
router.get('/my-profile', authorization.restrictToLoggedIn, function(req, res, next) {
    res.render('my-profile-user', {});
});

module.exports = {
    router: router,
    path: '/user'
};
