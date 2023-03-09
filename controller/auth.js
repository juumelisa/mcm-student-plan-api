const jwt = require('jsonwebtoken');
const responseHandler = require("../helpers/responseHandler");
const Student = require('../models/student');

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
    const token = jwt.sign(authData, process.env.APP_SECRET);
    return responseHandler(res, 200, token);
  }catch(err){
    return responseHandler(res, 500, 'Internal Server Error');
  }
};

exports.studentLogin = async(req, res) => {
  try{
    const { email, password } = req.body;
    const studentData = await Student.findOne({where: {email}})
    if(!studentData) return responseHandler(res, 400, 'Wrong credentials');
    if(studentData.password === `${studentData.full_name.split(' ')[0]}${studentData.student_id}` && studentData.password === password){
      return responseHandler(res, 200, 'Change your password first');
    }else{
      
      return responseHandler(res, 200,'Success', studentData);
    }
  }catch(err){
    return responseHandler(res, 500, 'Internal Server Error');
  }
}