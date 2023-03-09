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

exports.getSubjectDetail = async(req, res) => {
  try{
    const { code } = req.params;
    const result = await Subject.findByPk(code);
    if(!result) return responseHandler(res, 404, 'Data not found');
    return responseHandler(res, 200, result);
  }catch(err){
    return responseHandler(res, 500, err);
  }
}