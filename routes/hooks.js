var hatchet = require('hatchet');

module.exports = function (badgekit) {
  return {
    award: function awardHook(req, res) {
      console.log(req.body.email, req.body.badge);
      var hatchetData = {
        badge: req.body.badge,
        email: req.body.email,
        assertionUrl: req.body.assertionUrl,
        comment: req.body.comment
      };

      hatchet.send('badge_awarded', hatchetData);

      return res.send(200);
    },

    claim: function claimHook(req, res) {
      return res.send(200);
    },

    review: function reviewHook(req, res) {
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
  };
};
