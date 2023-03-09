var express = require('express');
const { studentLogin, studentChangePassword } = require('../controller/auth');
const { getAllStudent, getStudentDetail } = require('../controller/student');
const { verifyUser } = require('../helpers/auth');
var router = express.Router();

/* GET users listing. */
router.get('/', verifyUser, getAllStudent);
router.get('/:id', verifyUser, getStudentDetail);
router.post('/login', studentLogin);
router.post('/changePassword', studentChangePassword);

module.exports = router;
