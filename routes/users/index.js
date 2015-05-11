var express = require('express');
var router = express.Router();

// START: Routes
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
// END: Routes

module.exports = router;
