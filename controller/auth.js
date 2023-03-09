const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const responseHandler = require("../helpers/responseHandler");
const Student = require('../models/student');
const validator = require('validator');

exports.adminLogin = async(req, res) => {
  try{
    const { accessKey } = req.body
    if( accessKey !== process.env.ADMIN_ACCESS_KEY){
      return responseHandler(res, 403, 'Unauthorized');
    }
    const authData = {
      isAdmin: true,
      TTL: parseInt(new Date().getTime()/1000) + 86400
    }
    const sessionToken = jwt.sign(authData, process.env.APP_SECRET);
    return responseHandler(res, 200, 'Success', {sessionToken});
  }catch(err){
    return responseHandler(res, 500, 'Internal Server Error');
  }
};

exports.studentLogin = async(req, res) => {
  try{
    const { email, password } = req.body;
    if(!validator.isEmail(email)) return responseHandler(res, 400, 'Wrong email format');
    const studentData = await Student.findOne({where: {email}});
    if(!studentData) return responseHandler(res, 400, 'Wrong credentials');
    if(studentData.password === `${studentData.fullName.split(' ')[0]}${studentData.studentId}` && studentData.password === password){
      return responseHandler(res, 200, 'Change your password first');
    }else{
      const isValidPassword = await bcrypt.compare(password, studentData.password);
      if(!isValidPassword) return responseHandler(res, 400, 'Wrong credentials');
      const authData = {
        isAdmin: false,
        studentId: studentData.studentId,
        TTL: parseInt(new Date().getTime()/1000) + 86400
      }
      const token = jwt.sign(authData, process.env.APP_SECRET);
      return responseHandler(res, 200,'Success', {sessionToken: token});
    }
  }catch(err){
    return responseHandler(res, 500, 'Internal Server Error');
  }
}

exports.studentChangePassword = async(req, res) => {
  try{
    const body = req.body;
    if(!validator.isEmail(body.email)) return responseHandler(res, 400, 'Wrong email format');
    if(body.newPassword !== body.repeatNewPassword) return responseHandler(res, 400, 'Password not match');
    const studentData = await Student.findOne({where: {email: body.email}});
    if(!studentData) return responseHandler(res, 400, 'Wrong credentials');
    let newPasswordHash = await bcrypt.hash(body.newPassword, 8);
    if(studentData.password === `${studentData.fullName.split(' ')[0]}${studentData.studentId}`){
      if(studentData.password !== body.password) return responseHandler(res, 400, 'Wrong credentials');
    }else{
      const isValidPassword = await bcrypt.compare(body.password, studentData.password);
      if(!isValidPassword) return responseHandler(res, 400, 'Wrong credentials');
    }
    delete body.password;
    delete body.newPassword;
    delete body.repeatNewPassword;
    await Student.update({ password: newPasswordHash }, {
      where: {
        email: body.email
      }
    });
    return responseHandler(res, 200, 'Success')
  }catch(err){
    return responseHandler(res, 500, 'Internal Server Error');
  }
}