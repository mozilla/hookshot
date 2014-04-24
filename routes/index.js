var express = require('express');
var hatchet = require('hatchet');

module.exports = function(env) {

  var router = express.Router();
 var auth = require('./auth');

  router.get('/', function(req, res) {
    res.send('Webmaker Hookshoot is up and running');
  });

  // https://github.com/mozilla/badgekit-api/blob/master/docs/webhooks.md
  router.post('/webhook', auth, function(req, res) {
    console.log(req.body);
    // hatchet.send('badge_application_received', {
    //   email: 
    // });
  });

  return router;

};
