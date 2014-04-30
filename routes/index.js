var express = require('express');

module.exports = function(env) {
  var router = express.Router();
  var auth = require('./auth')(env);
  var badgekitApi = require('../lib/badgekit-api')(env);
  var badgekitUserApi = require('../lib/badgekit-user-api')(env);
  var hooks = require('./hooks')(env, badgekitApi, badgekitUserApi);

  router.get('/', function(req, res) {
    res.send('Webmaker Hookshoot is up and running');
  });

  router.post('/webhook', auth, function(req, res) {

    var hook = hooks[req.body.action];

    if (hook) {
      return hook(req, res);
    } else {
      return res.send(400, 'Invalid `action` specified');
    }

  });

  return router;

};
