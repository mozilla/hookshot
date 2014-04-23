module.exports = function(env) {
  var express = require('express');
  var bodyParser = require('body-parser');
  var routes = require('./routes');

  var app = express();

  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());

  // Add routes
  routes(env);

  return app;
};
