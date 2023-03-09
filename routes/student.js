var express = require('express');
const { studentLogin } = require('../controller/auth');
const { getAllStudent } = require('../controller/student');
const { verifyUser } = require('../helpers/auth');
var router = express.Router();

/* GET users listing. */
router.get('/', verifyUser, getAllStudent);
router.post('/login', studentLogin);

module.exports = router;
