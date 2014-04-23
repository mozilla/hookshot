var Habitat = require('habitat');
Habitat.load();

// Configuration
var env = new Habitat();
var server = require('./server')(env);

// Run server
server.listen(env.get('PORT', 1984), function () {
  console.log('Now listening on %d', env.get('PORT', 1984));
});
