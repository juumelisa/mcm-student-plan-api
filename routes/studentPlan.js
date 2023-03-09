var express = require('express');
const { getAllStudentPlan } = require('../controller/studentPlan');
var router = express.Router();

/* GET users listing. */
router.get('/', getAllStudentPlan);

module.exports = router;
