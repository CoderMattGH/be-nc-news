const logger = require('../logger/logger.js');
const topicsModel = require('../models/topics.model.js');
const topicValidator = require('../validators/topic.validator.js');

const getTopics = (req, res, next) => {
  logger.debug(`In getTopics() in topics.controller`);

  topicsModel.selectTopics()
      .then((topics) => {
        res.status(200).send({topics});
      })
      .catch((err) => {
        next(err);
      });
};

const postTopic = (req, res, next) => {
  logger.debug(`In postTopic() in topics.controller`);

  const {slug, description} = req.body;

  // Validate slug
  const slugValObj = topicValidator.validateSlug(slug);
  if (!slugValObj.valid) {
    next({status: 400, msg: slugValObj.msg});

    return;
  }

  // Validate description
  const descValObj = topicValidator.validateDescription(description);
  if (!descValObj.valid) {
    next ({status: 400, msg: descValObj.msg});

    return;
  }

  topicsModel.createTopic(slug, description)
      .then((topic) => {
        res.status(200).send({topic});
      })
      .catch((err) => {
        next(err);
      });
};

module.exports = {getTopics, postTopic};