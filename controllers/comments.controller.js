const logger = require('../logger/logger.js');
const commentsModel = require('../models/comments.model.js');

const deleteCommentById = (req, res, next) => {
  logger.debug(`In deleteCommentById() in comments.controller`);

  const {comment_id: commentId} = req.params;

  logger.info(`Deleting comment where comment_id:${commentId}`);

  commentsModel.deleteCommentById(commentId)
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        next(err);
      });
};

const patchCommentById = (req, res, next) => {
  logger.debug(`In patchCommentById() in comments.controller`);

  const {comment_id: commentId} = req.params;
  const {inc_votes: incVotes} = req.body;

  commentsModel.increaseVoteByCommentId(commentId, incVotes)
      .then((comment) => {
        res.status(200).send({comment});
      })
      .catch((err) => {
        next(err);
      });
};

module.exports = {deleteCommentById, patchCommentById};