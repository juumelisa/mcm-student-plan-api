var express = require('express');
const { getAllSubject, getSubjectDetail, addSubject } = require('../controller/subject');
const { verifyUser } = require('../helpers/auth');
var router = express.Router();

/* GET users listing. */
router.get('/', verifyUser, getAllSubject);
router.get('/:code', verifyUser, getSubjectDetail);
router.post('/', verifyUser, addSubject);

module.exports = router;
