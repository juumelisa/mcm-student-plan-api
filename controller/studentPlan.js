const Sequelize = require("sequelize");
const inputValidation = require("../helpers/inputValidation");
const responseHandler = require("../helpers/responseHandler");
const Student = require("../models/student");
const StudentPlan = require("../models/studentPlan");
const Subject = require("../models/subject");

exports.getAllStudentPlan = async(req, res) => {
  try{
    if(!req.user.isAdmin) return responseHandler(res, 403, 'Unauthorized');
    const isValidInput = await inputValidation([], ['groupBy'], req.body);
    if(isValidInput.isError){
      return responseHandler(res, 400, isValidInput.message);
    }
    const { groupBy } = req.body;
    const groupByEnum = ['studentId', 'subjectCode'];
    if(!groupByEnum.includes(groupBy)) return responseHandler(res, 400, `Available group by choices: ${groupByEnum.join(' and ')}`)
    const filter = {
    }
    if(groupBy && groupBy === 'studentId'){
      filter.attributes = [
        'studentId',
        [Sequelize.fn('COUNT', Sequelize.col('subjectCode')), 'subjectParticipation'],
      ]
      filter.include = [
        {
          model: Student,
          attributes: ['fullName']
        }
      ]
      filter.group = ['studentId'];
    }else if(groupBy && groupBy === 'subjectCode'){
      filter.attributes = [
        'subjectCode',
        [Sequelize.fn('COUNT', Sequelize.col('studentId')), 'participants'],
      ]
      filter.include = [
        {
          model: Subject,
          attributes: ['name']
        }
      ]
      filter.group = ['subjectCode'];
    }
    const result = await StudentPlan.findAll(filter)
    return responseHandler(res, 200, 'Success', result);
  }catch(err){
    console.log(err);
    return responseHandler(res, 500, 'Internal Server Error');
  }
}

exports.getSubjectParticipantByUser = async(req, res) => {
  try{
    const { studentId } = req.params;
    console.log(req.user);
    console.log(studentId)
    if(!req.user.isAdmin  && req.user.studentId !== parseInt(studentId)) return responseHandler(res, 403, 'Unauthorized');
    const result = await StudentPlan.findAll({
      where: {
        studentId
      },
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
    });
    return responseHandler(res, 200, 'Success', result);
  }catch(err){
    return responseHandler(res, 500, 'Internal Server Error');
  }
}

exports.getSubjectParticipantBySubject = async(req, res) => {
  try{
    if(!req.user.isAdmin) return responseHandler(res, 403, 'Unauthorized');
    const { subjectCode } = req.params;
    if(!subjectCode) return responseHandler(res, 400, 'Required: subjectCode');
    const result = await StudentPlan.findAll({
      where: {
        subjectCode
      },
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
    });
    console.log('RESULT: ', result);
    return responseHandler(res, 200, 'Success', result);
  }catch(err){
    return responseHandler(res, 500, 'Internal Server Error');
  }
}

exports.addStudentPlan = async(req, res) => {
  try{
    if(!req.user.studentId) return responseHandler(res, 403, 'Unauthorized');
    const isValidInput = await inputValidation(['subjectCode'], [], req.body);
    if(isValidInput.isError){
      return responseHandler(res, 400, isValidInput.message);
    }
    const { studentId } = req.user;
    const { subjectCode } = req.body;
    const subjectDetail = await Subject.findByPk(subjectCode);
    if(!subjectDetail) return responseHandler(res, 400, 'Subject not found');
    if(subjectDetail.dataValues.subjectLevel === 'DEPARTMENT' && subjectDetail.dataValues.department !== req.user.major) return responseHandler(res, 403,  `This course only available for ${subjectDetail.department} students`);
    const subjectParticipant = await StudentPlan.findAndCountAll({
      where: {
        subjectCode
      }
    });
    if(subjectParticipant.count >= 4) return responseHandler(res, 400, 'Out of quota');
    const studentParticipant = await StudentPlan.findAndCountAll({
      where: {
        studentId
      }
    });
    if(studentParticipant.count >= 3) return responseHandler(res, 400, 'Out of quota');
    const [participant, created] = await StudentPlan.findOrCreate({
      where: { studentId, subjectCode },
      defaults: {
        studentId,
        subjectCode,
        grade: "F"
      }
    })
    if(!created) return responseHandler(res, 400, 'Already participate');
    return responseHandler(res, 200, 'Success', participant);
  }catch(err){
    return responseHandler(res, 500, 'Internal Server Error');
  }
};

exports.deleteSubjectParticipation = async(req, res) => {
  try{
    if(!req.user.studentId) return responseHandler(res, 403, 'Unauthorized');
    const { id } = req.params;
    const getParticipantDetail = await StudentPlan.findByPk(id);
    if(!getParticipantDetail) return responseHandler(res, 404, 'Data not found');
    if(getParticipantDetail.studentId !== req.user.studentId) return responseHandler(res, 403, 'Unauthorized');
    await StudentPlan.destroy({
      where: {
        id
      }
    });
    return responseHandler(res, 200, 'Success');
  }catch(err){
    return responseHandler(res, 500, 'Internal Server Error');
  }
};

exports.updateStudentGrade = async(req, res) => {
  try{
    if(!req.user.isAdmin) return responseHandler(res, 403, 'Unauthorized');
    const isValidInput = await inputValidation(['id', 'grade'], [], req.body);
    if(isValidInput.isError){
      return responseHandler(res, 400, isValidInput.message);
    }
    const { id, grade } = req.body;
    if(!['A', 'B', 'C', 'D', 'E', 'F'].includes(grade)) return responseHandler(res, 404, 'Invalid Grade. Allow values: A, B, C, D, E or F');
    const subjectParticipantDetail = await StudentPlan.findByPk(id);
    if(!subjectParticipantDetail) return responseHandler(res, 404, 'Data not found');
    await StudentPlan.update({
      grade
    },
    {
      where: { id }
    })
    return responseHandler(res, 200, 'Success', {id, grade});
  }catch(err){
    return responseHandler(res, 500, 'Internal Server Error');
  }
}