const responseHandler = require("../helpers/responseHandler");
const Student = require("../models/student");
const bcrypt = require('bcryptjs');
const validator = require('validator');
const inputValidation = require("../helpers/inputValidation");
const mail = require("../helpers/mail");
const { Op } = require("sequelize");

exports.getAllStudent = async(req, res) => {
  try{
    if(req.user.isAdmin){
      const isValidInput = await inputValidation([], ['status', 'major', 'name', 'limit', 'page'], req.body);
      if(isValidInput.isError){
        return responseHandler(res, 400, isValidInput.message);
      }
      const { major, status, name, limit, page } = req.body;
      if(limit && !Number.isInteger(limit)){
        return responseHandler(res, 400, 'Limit should be an integer');
      }
      if(page && !Number.isInteger(page)){
        return responseHandler(res, 400, 'Page should be an integer');
      }
      const filter = {
        attributes: ['studentId', 'fullName', 'major', 'email', 'status'],
        limit: limit || limit,
        offset: ((page - 1) * limit) || 0,
      }
      if(major || status || name){
        filter.where = {}
        if(major){
          filter.where.major = major;
        }
        if(status){
          filter.where.status = status;
        }
        if(name){
          filter.where.fullName = {
            [Op.like]: `%${name.toUpperCase()}%`,
          };
        }
      }
      const result = await Student.findAndCountAll(filter)
      return responseHandler(res, 200, 'Success', result.rows, {count: result.count, page: page || 1}) ;
    }else{
      return responseHandler(res, 403, 'Unauthorized');
    }
  }catch(err){
    return responseHandler(res, 500, 'Internal Server Error');
  }
}

exports.getStudentDetail = async(req, res) => {
  try{
    const { id } = req.params;
    if(!id) return responseHandler(res, 400, 'Required: id');
    if(id.length < 2) return responseHandler(res, 400, 'Invalid id length');
    if(req.user.studentId !== parseInt(id) && !req.user.isAdmin) return responseHandler(res, 403, 'Unauthorized');
    const result = await Student.findByPk(id, {
      attributes: ['studentId', 'fullName', 'email', 'major', 'status', 'createdAt', 'updatedAt']
    });
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
    const requiredFields = ['fullName', 'email', 'major'];
    const isValidInput = await inputValidation(requiredFields, [], req.body);
    if(isValidInput.isError){
      return responseHandler(res, 400, isValidInput.message);
    }
    const { fullName, email, major} = req.body;
    if(!validator.isAlpha(fullName, ['en-US'], {ignore: " ."})) return responseHandler(res, 400, 'Name should be string characters contain alphabet and/or space and dot(.)');
    if(!validator.isEmail(email)) return responseHandler(res, 400, 'Wrong email format');
    const randomNumber = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    const student = await Student.create({
      fullName: fullName.toUpperCase(),
      email: email.toLowerCase(),
      major: major.toUpperCase(),
      password: await bcrypt.hash(`${fullName.split(' ')[0].toUpperCase()}${randomNumber}`, 8)
    });
    await mail.sendMail({
      from: process.env.APP_EMAIL,
      to: email.toLowerCase(),
      subject: 'Student Password',
      text: String(randomNumber),
      html:  `
      <p>Hi, ${fullName},</p>
      <p>Here's the password to access your student account:</p>
      <h3><b>${fullName.split(' ')[0].toUpperCase()}${randomNumber}</b></h3>
      <p>Please don't share this information to others. We recommend you to change the password as soon as possible.</p>
      `
    })
    return responseHandler(res, 200, 'Success', student)
  }catch(err){
    if(String(err.name).startsWith("SequelizeUniqueConstraintError")){
      if(String(err.errors[0].message).startsWith('email')){
        responseHandler(res, 400, 'Email already used');
      }else{
        return responseHandler(res, 400, err.errors[0].message);
      }
    }else{
      return responseHandler(res, 500, 'Internal server error');
    }
  }
}

exports.updateStudentData = async(req, res) => {
  try{
    if(!req.user.isAdmin) return responseHandler(res, 403, 'Unauthorized');
    const body = req.body;
    const isValidInput = await inputValidation(['studentId'], ['fullName', 'email', 'status', 'major'], body);
    if(isValidInput.isError){
      return responseHandler(res, 400, isValidInput.message);
    }
    if(body.fullName && !validator.isAlpha(body.fullName, ['en-US'], {ignore: " ."})) return responseHandler(res, 400, 'Name should only containe alphanumeric characters or dot(.)');
    if(body.email && !validator.isEmail(body.email)) return responseHandler(res, 400, 'Wrong email format');
    const studentData = await Student.findByPk(parseInt(body.studentId));
    if(!studentData) return responseHandler(res, 404, 'Data not found');
    const updateData = {};
    for(let x in body){
      if(x !== 'studentId'){
        updateData[x] = body[x]
      }
    }
    if(Object.keys(updateData).length === 0) return responseHandler(res, 400, 'No data change');
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
    if(!id) return responseHandler(res, 400, 'Required: id');
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