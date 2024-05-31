const logger = require('../logger/logger.js');
const topicsModel = require('../models/topics.model.js');

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

// RETURN 409 IF ALREADY EXISTS
const postTopic = (req, res, next) => {
  logger.debug(`In postTopic() in topics.controller`);

  const {slug, description} = req.body;

  topicsModel.createTopic(slug, description)
      .then((topic) => {
        res.status(200).send({topic});
      })
      .catch((err) => {
        next(err);
      });
};

module.exports = {getTopics, postTopic};