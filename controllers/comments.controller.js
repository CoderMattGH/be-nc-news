const logger = require('../logger/logger.js');
const commentsModel = require('../models/comments.model.js');
const commentValidator = require('../validators/comment.validator.js');
const miscValidator = require('../validators/misc.validator.js');

const deleteCommentById = (req, res, next) => {
  logger.debug(`In deleteCommentById() in comments.controller`);

  const commentId = Number(req.params.comment_id);

  // Validate ID
  const idValObj = miscValidator.validateId(commentId);
  if (!idValObj.valid) {
    next({status: 400, msg: idValObj.msg});

    return;
  }  

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

  let commentId = Number(req.params.comment_id);
  let incVotes = Number(req.body.inc_votes);

  // Validate ID
  const idValObj = miscValidator.validateId(commentId);
  if (!idValObj.valid) {
    next({status: 400, msg: idValObj.msg});

    return;
  }

  // Validate votes
  const voteValObj = commentValidator.validateVote(incVotes);
  if (!voteValObj.valid) {
    next({status: 400, msg: voteValObj.msg});

    return;
  }

  commentsModel.increaseVoteByCommentId(commentId, incVotes)
      .then((comment) => {
        res.status(200).send({comment});
      })
      .catch((err) => {
        next(err);
      });
};

module.exports = {deleteCommentById, patchCommentById};