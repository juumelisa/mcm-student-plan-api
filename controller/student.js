const responseHandler = require("../helpers/responseHandler");
const Student = require("../models/student");

exports.getAllStudent = async(req, res) => {
  try{
    const result = await Student.findAll({
      attributes: ['student_id', 'full_name', 'major', 'email']
    })
    return responseHandler(res, 200, result);
  }catch(err){
    console.log(err);
    return responseHandler(res, 500, 'Internal Server Error');
  }
}

exports.getStudentDetail = async(req, res) => {
  try{
    const result = await Student.findAll({
      attributes: ['student_id', 'full_name', 'major']
    })
    return responseHandler(res, 200, result);
  }catch{
    return responseHandler(res, 500, 'Internal Server Error');
  }
}