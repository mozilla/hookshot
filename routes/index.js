var express = require('express');
var UserClient = require('webmaker-user-client');

module.exports = function(env) {
  var router = express.Router();
  var auth = require('./auth')(env);
  var badgekitApi = require('../lib/badgekit-api')(env);
  var badgekitUserApi = require('../lib/badgekit-user-api')(env);
  var userClient = new UserClient({
    endpoint: env.get('LOGIN_URL_WITH_AUTH')
  });
  var hooks = require('./hooks')(env, badgekitApi, badgekitUserApi, userClient);

  router.get('/', function(req, res) {
    res.send('Webmaker Hookshoot is up and running');
  });

  router.post('/webhook', auth, function(req, res) {

    var hook = hooks[req.body.action];

    console.log('/webhook ' + req.body.action + ': %j', req.body);

    if (hook) {
      return hook(req, res);
    } else {
      return res.send(400, 'Invalid `action` specified');
    }

  });

  return router;

};
