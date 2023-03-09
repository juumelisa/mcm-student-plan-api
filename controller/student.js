const responseHandler = require("../helpers/responseHandler");
const Student = require("../models/student");
const bcrypt = require('bcryptjs');

exports.getAllStudent = async(req, res) => {
  try{
    if(req.user.isAdmin){
      const result = await Student.findAll({
        attributes: ['studentId', 'fullName', 'major', 'email', 'status']
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
    if(!req.user.isAdmin) return responseHandler(res, 403, 'Unauthorized');
    const { fullName, email, major, studentId} = req.body;
    const student = await Student.create({
      fullName,
      email,
      major,
      password: await bcrypt.hash(`${fullName.split(' ')[0]}${studentId}`, 8)
    })
    // if(!created) return responseHandler(res, 200, `Student with id ${studentId} exist`);
    // else{
      return responseHandler(res, 200, 'Success', {student})
    // }
  }catch(err){
    console.log(err);
    return responseHandler(res, 500, err);
  }
}

exports.updateStudentData = async(req, res) => {
  try{
    if(!req.user.isAdmin) return responseHandler(res, 403, 'Unauthorized');
    const body = req.body;
    const studentData = await Student.findByPk(parseInt(body.studentId));
    if(!studentData) return responseHandler(res, 404, 'Data not found');
    const updateData = {};
    for(let x in body){
      if(x !== 'studentId'){
        updateData[x] = body[x]
      }
    }
    await Student.update(updateData, {
      where: {
        studentId: body.studentId,
      }
    })
    return responseHandler(res, 200, 'Success', updateData);
  }catch(err){
    return responseHandler(res, 500, err);
  }
}

exports.deleteStudent = async(req, res) => {
  try{
    if(!req.user.isAdmin) return responseHandler(res, 403, 'Unauthorized');
    const { id } = req.params;
    const studentData = await Student.findByPk(parseInt(id));
    if(!studentData) return responseHandler(res, 404, 'Data not found');
    await Student.destroy({
      where: {
        studentId: id
      }
    })
    return responseHandler(res, 200, 'Success');
  }catch(err){
    return responseHandler(res, 500, err);
  }
}