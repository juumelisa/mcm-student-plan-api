var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.json({
    error: 0,
    message: 'Student list'
  });
});

module.exports = router;
