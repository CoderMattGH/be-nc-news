const commentsRouter = require('express').Router();

const commentsController = require('../controllers/comments.controller.js');

commentsRouter.route('/:comment_id')
    .delete(commentsController.deleteCommentById)
    .patch(commentsController.patchCommentById);

module.exports = commentsRouter;