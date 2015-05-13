var express = require('express');
var router = express.Router();

// START: Routes
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Home' });
});
// END: Routes

module.exports = router;
