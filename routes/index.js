var express = require('express');

module.exports = function(env) {

  var router = express.Router();

  // Healthcheck
  router.get('/', function(req, res) {
    res.send('Webmaker Hookshoot is up and running');
  });

  return router;

};
