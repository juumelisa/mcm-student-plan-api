const responseHandler = require('./responseHandler');
const jwt = require('jsonwebtoken');

exports.verifyUser = async(req, res, next) => {
  try{
    const token = req.headers.authorization;
    if(!token){
      return responseHandler(res, 403, 'Unauthorized');
    }else{
      const payload = jwt.verify(token, process.env.APP_SECRET);
      req.user = payload;
      console.log(payload);
      console.log(new Date().getTime())
      if(!payload || !payload.isAdmin) return responseHandler(res, 403, 'Unauthorized')
      if(payload.TTL < new Date().getTime()/1000) return responseHandler(res, 403, 'Expired session');
      return next();
    }
  }catch(err){
    console.log(err);
    return responseHandler(res, 500, 'Internal server error');
  }
}