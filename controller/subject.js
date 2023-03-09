const responseHandler = require("../helpers/responseHandler");
const Subject = require("../models/subject");
const validator = require('validator');

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
    return responseHandler(res, 200, 'Success', result);
  }catch(err){
    return responseHandler(res, 500, err);
  }
}

exports.addSubject = async(req, res) => {
  try{
    if(!req.user.isAdmin) return responseHandler(res, 403, 'Unauthorized');
    const { code, name, subjectLevel, department, faculty } = req.body;
    if(!validator.isAlpha(name, ['en-US'], {ignore: " .-"})) return responseHandler(res, 400, 'Subject name should only contain alphabet, dash(-) or dot(.)')
    const result = await Subject.create({
      code, name, subjectLevel, department, faculty
    })
    return responseHandler(res, 200, 'Success', result);
  }catch(err){
    if(err.name && String(err.name).startsWith("SequelizeUniqueConstraintError")){
      if(String(err.errors[0].message).startsWith('PRIMARY')){
        responseHandler(res, 400, `Subject with Code ${req.body.code} already exist.`);
      }else if(String(err.errors[0].message).startsWith('name')){
        responseHandler(res, 400, `Subject ${req.body.name} already exist.`);
      }else{
        return responseHandler(res, 400, err.errors[0].message);
      }
    }else{
      return responseHandler(res, 500, 'Internal server error');
    }
  }
}

exports.updateSubject = async(req, res) => {
  try{
    if(!req.user.isAdmin) return responseHandler(res, 403, 'Unauthorized');
    const updateData = {};
    for(let x in req.body){
      if(x !== 'code'){
        updateData[x] = req.body[x];
      }
    }
    await Subject.update(updateData, {
      where: {
        code: req.body.code
      }
    })
    return responseHandler(res, 200, 'Success', updateData)
  }catch(err){
    return responseHandler(res, 500, err);
  }
}

exports.deleteSubject = async(req, res) => {
  try{
    if(!req.user.isAdmin) return responseHandler(res, 403, 'Unauthorized');
    const { code } = req.params;
    const subjectData = await Subject.findByPk(code);
    if(!subjectData) return responseHandler(res, 404, 'Data not found');
    await Subject.destroy({
      where: {
        code
      }
    })
    return responseHandler(res, 200, 'Success');
  }catch(err){
    console.log(err);
    return responseHandler(res, 500, err);
  }
}