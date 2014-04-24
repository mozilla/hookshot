var jwt = require('jsonwebtoken');
var crypto = require('crypto');

module.exports = function(env) {

  function sha256(body) {
    return crypto.createHash('sha256').update(body).digest('hex');
  }

  return function auth(req, res, next) {

     var token = req.headers.authorization.slice(token.indexOf('"') + 1, -1);

     if (!token) {
       return next('No authorization header');
     }

     jwt.verify(token, env.get(env.get('WEBHOOK_SECRET'), function(err, decodedToken) {
      if (err) {
        return next(err);
      }

      console.log(decodedToken);

      if (decodedToken.payload.body.hash !== sha256(JSON.stringify(req.body))) {
        return next('Request body hash does not match token hash');
      }

      return next();

     });

   };
};

 // function auth(req, res, next) {
 //    const param = req.body;
 //    var token = req.headers.authorization;
 //    token = token.slice(token.indexOf('"')+1, -1);
 //    const email = param.email;

 //    if (!jws.verify(token, JWT_SECRET)) {
 //      msg = 'verification of jws failed';
 //      return respondWithForbidden(res, msg);
 //    }

 //    const now = Date.now()/1000|0;
 //    var decodedToken, msg;
 //    if (!token)
 //      return respondWithForbidden(res, 'missing mandatory `authorization` header');
 //    try {
 //      decodedToken = jws.decode(token);
 //    } catch(err) {
 //      return respondWithForbidden(res, 'error decoding JWT: ' + err.message);
 //    }

 //    if (decodedToken.payload.body.hash !== sha256(JSON.stringify(req.body))) {
 //      return respondWithForbidden(res, 'request body hash does not match token hash');
 //    }

 //    return next();
 //  }
