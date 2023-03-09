const responseHandler = require("../helpers/responseHandler");
const Student = require("../models/student");

exports.getAllStudent = async(req, res) => {
  try{
    console.log('Student: ', Student)
    const result = await Student.findAll()
    console.log('result: ', result)
    return responseHandler(res, 200, result);
  }catch(err){
    return responseHandler(res, 500, 'Internal Server Error');
  }
}