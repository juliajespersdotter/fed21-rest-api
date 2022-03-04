/**
 * Authentication Middleware
 */

const debug = require('debug')('photo_album:auth');
const jwt = require('jsonwebtoken');


/**
 * Validate JWT token
 */
 const validateJwtToken = (req, res, next) => {
    if(!req.headers.authorization){
       debug('Authorization header missing');

       return res.status(401).send({
           status: 'fail',
           data: 'Authorization required',
       });
   }

   // Authorization: "Bearer xxxxxx.xxxxx.xxxx"
   const [authSchema, token] = req.headers.authorization.split(' ');
   if(authSchema.toLowerCase() !== "bearer") {
       // not ours to authenticate
       debug("Authorization schema isn't bearer");

       return res.status(401).send({
           status: 'fail',
           data: 'Authorization required',
       });
   }

   try {
       req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
       
   } catch (error) {
           return res.status(401).send({
               status: 'fail',
               data: 'Authorization required',
           });
   }

   next();
}


module.exports = {
    validateJwtToken,
}