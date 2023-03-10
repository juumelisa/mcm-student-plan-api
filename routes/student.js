var express = require('express');
const { studentLogin, studentChangePassword, resetPassword } = require('../controller/auth');
const { getAllStudent, getStudentDetail, addStudent, deleteStudent, updateStudentData } = require('../controller/student');
const { verifyUser } = require('../helpers/auth');
var router = express.Router();

/* GET users listing. */
router.get('/', verifyUser, getAllStudent);
router.get('/:id', verifyUser, getStudentDetail);
router.post('/add', verifyUser, addStudent);
router.patch('/', verifyUser, updateStudentData);
router.delete('/:id', verifyUser, deleteStudent);
router.post('/login', studentLogin);
router.post('/changePassword', studentChangePassword);
router.post('/resetPassword', resetPassword);

module.exports = router;
