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
    return responseHandler(res, 200, 'Success', result);
  }catch(err){
    return responseHandler(res, 500, err);
  }
}

exports.addSubject = async(req, res) => {
  try{
    if(!req.user.isAdmin) return responseHandler(res, 403, 'Unauthorized');
    const { code, name, subjectLevel, department, faculty } = req.body;
    const result = await Subject.create({
      code, name, subjectLevel, department, faculty
    })
    return responseHandler(res, 200, 'Success', result);
  }catch(err){
    return responseHandler(res, 500, err);
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