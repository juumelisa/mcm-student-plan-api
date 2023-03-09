var express = require('express');
const { getAllStudentPlan, addStudentPlan, getSubjectParticipantByUser, getSubjectParticipantBySubject, deleteSubjectParticipation,  } = require('../controller/studentPlan');
const { verifyUser } = require('../helpers/auth');
var router = express.Router();

/* GET users listing. */
router.get('/', verifyUser, getAllStudentPlan);
router.get('/student/:studentId', verifyUser, getSubjectParticipantByUser);
router.get('/subject/:subjectCode', verifyUser, getSubjectParticipantBySubject);
router.post('/', verifyUser, addStudentPlan);
router.delete('/:id', verifyUser, deleteSubjectParticipation);

module.exports = router;
