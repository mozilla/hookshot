var express = require('express');
var hatchet = require('hatchet');

module.exports = function(env) {
  var router = express.Router();
  var auth = require('./auth')(env);
  var badgekit = require('../lib/badgekit-api')(env);
  var hooks = require('./hooks');

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
