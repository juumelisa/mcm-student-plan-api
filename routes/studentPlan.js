var express = require('express');
const { getAllStudentPlan, addStudentPlan } = require('../controller/studentPlan');
const { verifyUser } = require('../helpers/auth');
var router = express.Router();

/* GET users listing. */
router.get('/', verifyUser, getAllStudentPlan);
router.post('/', verifyUser, addStudentPlan);

module.exports = router;
