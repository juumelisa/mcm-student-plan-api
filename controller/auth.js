const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const responseHandler = require("../helpers/responseHandler");
const Student = require('../models/student');
const validator = require('validator');
const inputValidation = require('../helpers/inputValidation');
const mail = require('../helpers/mail');

exports.adminLogin = async(req, res) => {
  try{
    const { accessKey } = req.body;
    if(!accessKey) return responseHandler(res, 400, 'Required accessKey');
    if(accessKey.length < 10) return responseHandler(res, 400, 'Invalid accessKey length');
    if(accessKey !== process.env.ADMIN_ACCESS_KEY){
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
    const isValidInput = await inputValidation(['email', 'password'], [], req.body);
    if(isValidInput.isError){
      return responseHandler(res, 400, isValidInput.message);
    }
    const { email, password } = req.body;
    if(password.length < 6) return responseHandler(res, 400, 'Minimum password length is 6 characters');
    if(!validator.isEmail(email)) return responseHandler(res, 400, 'Wrong email format');
    const studentData = await Student.findOne({where: {email}});
    if(!studentData) return responseHandler(res, 400, 'Wrong credentials');
    const isValidPassword = await bcrypt.compare(password, studentData.password);
    if(!isValidPassword) return responseHandler(res, 400, 'Wrong credentials');
    const authData = {
      isAdmin: false,
      studentId: studentData.studentId,
      major: studentData.major,
      TTL: parseInt(new Date().getTime()/1000) + 86400
    }
    const token = jwt.sign(authData, process.env.APP_SECRET);
    return responseHandler(res, 200,'Success', {sessionToken: token});
  }catch(err){
    return responseHandler(res, 500, 'Internal Server Error');
  }
}

exports.studentChangePassword = async(req, res) => {
  try{
    const body = req.body;
    const isValidInput = await inputValidation(['email', 'password', 'newPassword', 'repeatNewPassword'], [], body);
    if(isValidInput.isError){
      return responseHandler(res, 400, isValidInput.message);
    }
    if(!validator.isEmail(body.email)) return responseHandler(res, 400, 'Wrong email format');
    if(!validator.isStrongPassword(body.newPassword, { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 })) return responseHandler(res, 400, 'Password should contain 6 characters or more, combine uppercase, lowercase & number')
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
};

exports.resetPassword = async(req, res) => {
  try{
    const isValidInput = await inputValidation(['studentId'], [], req.body);
    if(isValidInput.isError){
      return responseHandler(res, 400, isValidInput.message);
    }
    const { studentId } = req.body;
    if(!studentId) return responseHandler(res, 400, 'Requires: studentId');
    const studentData = await Student.findByPk(studentId);
    if(!studentData) return responseHandler(res, 400, 'Data not found');
    const randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    await Student.update(
      {
        password: await bcrypt.hash(`${studentData.fullName.split(' ')[0].toUpperCase()}${randomNumber}`, 8)
      },
      {
        where: {
          studentId
        }
      }
    )
    await mail.sendMail({
      from: process.env.APP_EMAIL,
      to: studentData.email,
      subject: 'Reset Password',
      text: String(randomNumber),
      html:  `
      <p>Hi, ${studentData.fullName},</p>
      <p>Here's the password to access your student account:</p>
      <h3><b>${studentData.fullName.split(' ')[0].toUpperCase()}${randomNumber}</b></h3>
      <p>Please don't share this information to others. We recommend you to change the password as soon as possible.</p>
      `
    })
    const arrEmail = studentData.email.split('@');
    const firstWordEmail = arrEmail[0].slice(0,3);
    const emailHost = (arrEmail[1].split('.'))[1];
    return responseHandler(res, 200, `We has send your new password to your email ${firstWordEmail}***@***.${emailHost}`)
  }catch(err){
    return responseHandler(res, 500, 'Internal Server Error');
  }
};