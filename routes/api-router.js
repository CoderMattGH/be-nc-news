const apiRouter = require('express').Router();

const apiController = require('../controllers/api.controller.js');

const topicsRouter = require('./topics-router.js');
const usersRouter = require('./users-router.js');

apiRouter.get('/', apiController.getEndpoints);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;