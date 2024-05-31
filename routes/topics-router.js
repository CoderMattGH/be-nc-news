const topicsRouter = require('express').Router();

const topicsController = require('../controllers/topics.controller.js');

topicsRouter.route('/')
    .get(topicsController.getTopics)
    .post(topicsController.postTopic);

module.exports = topicsRouter;