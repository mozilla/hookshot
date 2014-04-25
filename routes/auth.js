var jwt = require('jsonwebtoken');
var crypto = require('crypto');

module.exports = function(env) {

  function sha256(body) {
    return crypto.createHash('sha256').update(body).digest('hex');
  }

  return function auth(req, res, next) {
    token = req.headers.authorization.slice(req.headers.authorization.indexOf('"')+1, -1);

    if (!token) {
      return next('No authorization header');
    }

    jwt.verify(token, env.get('WEBHOOK_SECRET'), function(err, decodedToken) {
      if (err) {
        return next(err);
      }

      if (decodedToken.body.hash !== sha256(JSON.stringify(req.body))) {
        return next('Request body hash does not match token hash');
      }

      return next();
     });
   };
};
