var express = require('express');
const { getAllStudent } = require('../controller/student');
const { verifyUser } = require('../helpers/auth');
var router = express.Router();

/* GET users listing. */
router.get('/', verifyUser, getAllStudent);

module.exports = router;
