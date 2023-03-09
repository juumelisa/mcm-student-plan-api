const jwt = require('jsonwebtoken');
const responseHandler = require("../helpers/responseHandler")

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
    console.log(err)
    return responseHandler(res, 500, 'Internal Server Error');
  }
}