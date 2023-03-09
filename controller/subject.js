const responseHandler = require("../helpers/responseHandler");
const Subject = require("../models/subject");

exports.getAllSubject = async(req, res) => {
  try{
    const result = await Subject.findAll()
    return responseHandler(res, 200, result);
  }catch(err){
    return responseHandler(res, 500, 'Internal Server Error');
  }
}