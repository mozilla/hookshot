exports = module.exports = function(env) {
  return require('badgekit-api-client')(
    env.get('BADGEKIT_API_URL'), { 
      key: env.get('BADGEKIT_API_KEY'), 
      secret: env.get('BADGEKIT_API_SECRET') 
    });
};

