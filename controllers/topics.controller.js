const topicsModel = require('../models/topics.model.js');

const getTopics = (req, res, next) => {
  console.log("In getTopics() in topics.controller!");

  topicsModel.selectTopics()
    .then((topics) => {
      res.status(200).send({topics: topics});
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics };