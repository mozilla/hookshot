var express = require('express');
var hatchet = require('hatchet');

module.exports = function(env) {

  var router = express.Router();
  var auth = require('./auth');

  router.get('/', function(req, res) {
    res.send('Webmaker Hookshoot is up and running');
  });

  router.post('/webhook', auth, function(req, res) {

    // Testing!
    console.log(req.body);

    // This should be some stuff that is received from the webhook
    var data = {};

    hatchet.send('badge_application_received', data);

  });

  return router;

};
