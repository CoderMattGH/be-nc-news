const logger = require('../logger/logger.js');
const topicsModel = require('../models/topics.model.js');

const getTopics = (req, res, next) => {
  logger.debug("In getTopics() in topics.controller");

  topicsModel.selectTopics()
      .then((topics) => {
        res.status(200).send({topics});
      })
      .catch((err) => {
        next(err);
      });
};

module.exports = {getTopics};