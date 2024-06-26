const apiRouter = require('express').Router();

const apiController = require('../controllers/api.controller.js');

const topicsRouter = require('./topics-router.js');
const usersRouter = require('./users-router.js');
const commentsRouter = require('./comments-router.js');
const articlesRouter = require('./articles-router.js');

apiRouter.get('/', apiController.getEndpoints);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/articles', articlesRouter);

module.exports = apiRouter;