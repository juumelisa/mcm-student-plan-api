const responseHandler = require("../helpers/responseHandler");
const StudentPlan = require("../models/studentPlan");

exports.getAllStudentPlan = async(req, res) => {
  try{
    const result = await StudentPlan.findAll()
    return responseHandler(res, 200, result);
  }catch(err){
    return responseHandler(res, 500, 'Internal Server Error');
  }
}