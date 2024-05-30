const topicsRouter = require('express').Router();

const topicsController = require('../controllers/topics.controller.js');

topicsRouter.get('/', topicsController.getTopics);

module.exports = topicsRouter;