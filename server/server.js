module.exports = function(env) {
  var express = require('express');
  var bodyParser = require('body-parser');
  var morgan = require('morgan');

  var app = express();
  var routes = require('../routes')(env);

  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(routes);

  return app;
};
