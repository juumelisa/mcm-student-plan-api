var express = require('express');
const { getAllStudent } = require('../controller/student');
var router = express.Router();

/* GET users listing. */
router.get('/', getAllStudent);

module.exports = router;
