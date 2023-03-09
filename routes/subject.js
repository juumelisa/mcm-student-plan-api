var express = require('express');
const { getAllSubject } = require('../controller/subject');
var router = express.Router();

/* GET users listing. */
router.get('/', getAllSubject);

module.exports = router;
