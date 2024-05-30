const logger = require('../logger/logger.js');
const commentsModel = require('../models/comments.model.js');

const deleteCommentById = (req, res, next) => {
  logger.debug(`In deleteCommentById() in comments.controller`);

  const commentId = req.params.comment_id;

  logger.info(`Deleting comment where comment_id:${commentId}`);

  commentsModel.deleteCommentById(commentId)
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        next(err);
      });
};

module.exports = {deleteCommentById};