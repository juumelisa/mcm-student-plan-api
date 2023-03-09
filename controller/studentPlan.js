const responseHandler = require("../helpers/responseHandler");
const Student = require("../models/student");
const StudentPlan = require("../models/studentPlan");
const Subject = require("../models/subject");

exports.getAllStudentPlan = async(req, res) => {
  try{
    if(!req.user.isAdmin) return responseHandler(res, 403, 'Unauthorized');
    const result = await StudentPlan.findAll({
      include: [
        {
          model: Student,
          attributes: ['fullName']
        },
        {
          model: Subject,
          attributes: ['name']
        }
    ]
    })
    console.log(result);
    return responseHandler(res, 200, 'Success', result);
  }catch(err){
    console.log(err);
    return responseHandler(res, 500, 'Internal Server Error');
  }
}

exports.addStudentPlan = async(req, res) => {
  try{
    console.log(req.user)
    if(!req.user.studentId) return responseHandler(res, 403, 'Unauthorized');
    const { studentId } = req.user;
    const { subjectCode } = req.body;
    const subjectParticipant = await StudentPlan.findAndCountAll({
      where: {
        subjectCode
      }
    });
    if(subjectParticipant.count > 3) return responseHandler(res, 400, 'Out of quota');
    
    const [participant, created] = await StudentPlan.findOrCreate({
      where: { studentId, subjectCode },
      defaults: {
        studentId,
        subjectCode,
        grade: "F"
      }
    })
    // await StudentPlan.create({
    //   subjectCode,
    //   studentId
    // });
    if(created) return responseHandler(res, 400, 'Already participate');
    return responseHandler(res, 200, 'Success', participant);
  }catch(err){
    console.log(err);
    return responseHandler(res, 500, 'Internal Server Error');
  }
}