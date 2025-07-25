const jwt = require('jsonwebtoken');

function attachUserIfLoggedIn(req,res,next){
    const token = req.cookies?.token;
    if(!token){
      // console.log("token not found ");
       return next();
    }
    try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
  } catch (err) {}
  next();

};

module.exports={attachUserIfLoggedIn};