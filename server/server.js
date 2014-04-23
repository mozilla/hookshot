module.exports = function(env) {
  var express = require('express');
  var bodyParser = require('body-parser');
  var morgan = require('morgan');

  var app = express();
  // var routes = require('./routes');

  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());

  // Add routes
  //routes(env);

  return app;
};
