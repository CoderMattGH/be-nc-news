const commentsRouter = require('express').Router();

const commentsController = require('../controllers/comments.controller.js');

commentsRouter.delete('/:comment_id', commentsController.deleteCommentById);

module.exports = commentsRouter;