const responseHandler = require("../helpers/responseHandler");
const Subject = require("../models/subject");
const validator = require('validator');
const inputValidation = require("../helpers/inputValidation");

exports.getAllSubject = async(req, res) => {
  try{
    const isValidInput = await inputValidation([], ['limit', 'page'], req.body);
    if(isValidInput.isError){
      return responseHandler(res, 400, isValidInput.message);
    }
    const { limit, page } = req.body;
    if(limit && !Number.isInteger(limit)){
      return responseHandler(res, 400, 'Limit should be an integer');
    }
    if(page && !Number.isInteger(page)){
      return responseHandler(res, 400, 'Page should be an integer');
    }
    const result = await Subject.findAll({
      limit: limit || 10,
      page: (page - 1) * limit || 0,
    })
    return responseHandler(res, 200, 'Success', result, {limit: limit || 10, page: page || 1});
  }catch(err){
    return responseHandler(res, 500, 'Internal Server Error');
  }
}

exports.getSubjectDetail = async(req, res) => {
  try{
    const { code } = req.params;
    if(!code || code.length < 3) return responseHandler(res, 400, 'Wrong code format');
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
    const isValidInput = await inputValidation(['code', 'name', 'subjectLevel', 'department', 'faculty'], [], req.body);
    if(isValidInput.isError){
      return responseHandler(res, 400, isValidInput.message);
    }
    let { code, name, subjectLevel, department, faculty } = req.body;
    const subjectLevelEnum = ['UNIVERSITY', 'FACULTY', 'DEPARTMENT'];
    if(!subjectLevelEnum.includes(subjectLevel.toUpperCase())) return responseHandler(res, 400, `subjectLevel valid value: ${subjectLevelEnum.join(', ')}`);
    if(subjectLevel.toUpperCase() == 'UNIVERSITY'){
      department = "";
      faculty = "";
    }else if(subjectLevel.toUpperCase() == 'FACULTY'){
      department = "";
      if(faculty.length < 1) return responseHandler(res, 400, 'Wrong faculty');
    }else if(subjectLevel.toUpperCase() == 'DEPARTMENT'){
      faculty = "";
      if(department.length < 1) return responseHandler(res, 400, 'Wrong faculty');
    }
    if(!validator.isAlpha(name, ['en-US'], {ignore: " .-"})) return responseHandler(res, 400, 'Subject name should only contain alphabet, dash(-) or dot(.)')
    const result = await Subject.create({
      code: code.toUpperCase(),
      name: name.toUpperCase(),
      subjectLevel: subjectLevel.toUpperCase(),
      department: department.toUpperCase(),
      faculty: faculty.toUpperCase()
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
    const isValidInput = await inputValidation(['code'], ['name', 'subjectLevel', 'department', 'faculty'], req.body);
    if(isValidInput.isError){
      return responseHandler(res, 400, isValidInput.message);
    }
    if(req.body.subjectLevel){
      const subjectLevelEnum = ['UNIVERSITY', 'FACULTY', 'DEPARTMENT'];
      if(!subjectLevelEnum.includes(req.body.subjectLevel.toUpperCase())) return responseHandler(res, 400, `subjectLevel valid value: ${subjectLevelEnum.join(', ')}`);
    }if(req.bodysubjectLevel.toUpperCase() == 'UNIVERSITY'){
      req.body.subjectLevel = req.bodysubjectLevel.toUpperCase();
      req.body.department = "";
      req.body.faculty = "";
    }else if(req.bodysubjectLevel.toUpperCase() == 'FACULTY'){
      req.body.subjectLevel = req.bodysubjectLevel.toUpperCase();
      req.body.department = "";
      if(req.body.length < 1) return responseHandler(res, 400, 'Wrong faculty');
    }else if(req.bodysubjectLevel.toUpperCase() == 'DEPARTMENT'){
      req.body.subjectLevel = req.bodysubjectLevel.toUpperCase();
      req.body.faculty = "";
      if(req.body.department.length < 1) return responseHandler(res, 400, 'Wrong department');
    }
    const updateData = {};
    for(let x in req.body){
      if(x !== 'code'){
        updateData[x] = req.body[x];
      }
    }
    if(Object.keys(updateData).length === 0) return responseHandler(res, 400, 'No data change');
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
    if(!code) return responseHandler(res, 400, 'Required: code');
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