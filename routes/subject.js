var express = require('express');
const { getAllSubject, getSubjectDetail, addSubject, updateSubject, deleteSubject } = require('../controller/subject');
const { verifyUser } = require('../helpers/auth');
var router = express.Router();

/* GET users listing. */
router.get('/', verifyUser, getAllSubject);
router.get('/:code', verifyUser, getSubjectDetail);
router.post('/', verifyUser, addSubject);
router.patch('/', verifyUser, updateSubject);
router.delete('/:code', verifyUser, deleteSubject);

module.exports = router;
