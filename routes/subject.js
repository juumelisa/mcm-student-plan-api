var express = require('express');
const { getAllSubject, getSubjectDetail } = require('../controller/subject');
const { verifyUser } = require('../helpers/auth');
var router = express.Router();

/* GET users listing. */
router.get('/', verifyUser, getAllSubject);
router.get('/:code', verifyUser, getSubjectDetail);

module.exports = router;
