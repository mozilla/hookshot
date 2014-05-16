var hatchet = require('hatchet');

module.exports = function (env, badgekitApi, badgekitUserApi, userClient) {
  const BADGEKIT_API_SYSTEM = env.get('BADGEKIT_API_SYSTEM', 'webmaker');
  const MENTOR_BADGE_SLUG = env.get('MENTOR_BADGE_SLUG', 'webmaker-super-mentor');

  return {
    award: function awardHook(req, res, next) {

      userClient.get.byEmail(req.body.email, function (err, user) {

        if (err) {
          console.log(err.stack);
        }

        var hatchetData = {
          badge: req.body.badge,
          email: req.body.email,
          user: user,
          assertionUrl: req.body.assertionUrl,
          comment: req.body.comment
        };

        hatchet.send('badge_awarded', hatchetData);

        if (req.body.badge.slug === MENTOR_BADGE_SLUG) {
          var permissionOptions = {
            email: req.body.email,
            context: { system: BADGEKIT_API_SYSTEM },
            permissions: { canReview: 'true' }
          };

          badgekitUserApi.setUserPermissions(permissionOptions);
          userClient.update.byEmail(req.body.email, {
            isCollaborator: true
          }, function (err, user) {
            if (err) {
              // We need some better error handling
              return console.log(err);
            }
          });
        }

        return res.send(200);

      });
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
        badgekitApi.updateApplication({ system: badge.system.slug, badge: badge.slug, application: application }, function (err) {
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
        return badgekitApi.createBadgeInstance(query, finish);
      }
      else {
        hatchet.send('badge_application_denied', hatchetData);
        return finish();
      }
    }
  };
};
