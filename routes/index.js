var express = require('express');
var hatchet = require('hatchet');

module.exports = function(env) {
  var router = express.Router();
  var auth = require('./auth')(env);
  var badgekit = require('../lib/badgekit-api')(env);

  router.get('/', function(req, res) {
    res.send('Webmaker Hookshoot is up and running');
  });

  function awardHook(req, res) {
    var hatchetData = {
      badge: req.body.badge,
      email: req.body.recipient,
      assertionUrl: req.body.assertionUrl
    };

    hatchet.send('badge_awarded', hatchetData);

    return res.send(200);
  }

  function claimHook(req, res) {
    return res.send(200);
  }

  function reviewHook(req, res) {
    if (!req.body.application || !req.body.application.badge || !req.body.review)
      return res.send(400, { error: 'Improperly formatted `review` call' });

    const approved = req.body.approved;
    const application = req.body.application;
    const review = req.body.review;
    const badge = application.badge;

    function finish(err) {
      if (err && err.code !== 409)
        return res.send(500, { error: err });

      application.processed = new Date();
      badgekit.updateApplication({ system: badge.system.slug, badge: badge.slug, application: application }, function (err) {
        if (err)
          return res.send(500, { error: err});

        return res.send(200);
      });
    }

    const hatchetData = {
      email: application.learner,
      application: application,
      review: review
    };

    if (approved) {
      var query = {
        system: badge.system.slug,
        badge: badge.slug,
        email: application.learner
      }

      hatchet.send('badge_application_approved', hatchetData);
      return badgekit.createBadgeInstance(query, finish);
    }
    else {
      hatchet.send('badge_application_denied', hatchetData);
      return finish();
    }
  }

  router.post('/webhook', auth, function(req, res) {
    switch (req.body.action) {
      case 'award':
        return awardHook(req, res);
      case 'claim':
        return claimHook(req, res);
      case 'review':
        return reviewHook(req, res);
      default:
        return res.send(400, 'Invalid `action` specified');
      }
  });

  return router;

};
