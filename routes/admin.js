var express = require('express');
const { adminLogin } = require('../controller/auth');
var router = express.Router();

/* GET users listing. */
router.post('/login', adminLogin);

module.exports = router;
