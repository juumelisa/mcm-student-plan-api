const responseHandler = require("../helpers/responseHandler");
const Student = require("../models/student");

exports.getAllStudent = async(req, res) => {
  try{
    if(req.user.isAdmin){
      const result = await Student.findAll({
        attributes: ['studentId', 'fullName', 'major', 'email']
      })
      return responseHandler(res, 200, 'Success',result);
    }else{
      return responseHandler(res, 403, 'Unauthorized');

    }
  }catch(err){
    console.log(err);
    return responseHandler(res, 500, 'Internal Server Error');
  }
}

exports.getStudentDetail = async(req, res) => {
  try{
    const { id } = req.params;
    console.log(id);
    console.log(req.user.studentId)
    if(req.user.studentId !== parseInt(id) && !req.user.isAdmin) return responseHandler(res, 403, 'Unauthorized');
    const result = await Student.findByPk(id);
    console.log(result);
    if(!result) return responseHandler(res, 404, 'Student not found');
    return responseHandler(res, 200, result);
  }catch{
    return responseHandler(res, 500, 'Internal Server Error');
  }
}

exports.addStudent = async(req, res) => {
  try{
    const { fullName, email, major, studentId} = req.body;
    const [student, created] = await Student.findOrCreate({
      where: { studentId },
      defaults: {
        fullName,
        email,
        major
      }
    })
    return responseHandler(res, 200, 'Success', {student, created})
  }catch(err){
    return responseHandler(res, 500, 'Internal Server Error');
  }
}