var Habitat = require('habitat');
Habitat.load();

// Configuration with defaults
var env = new Habitat('default', {
  PORT: 1984
});

var server = require('./server')(env);

// Run server
server.listen(env.get('PORT'), function () {
  console.log('Now listening on %d', env.get('PORT'));
});
