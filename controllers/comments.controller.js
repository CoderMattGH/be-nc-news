const logger = require('../logger/logger.js');
const commentsModel = require('../models/comments.model.js');
const miscService = require('../services/misc.service.js');

const getCommentsByArticleId = (req, res, next) => {
  logger.debug(`In getCommentsByArticleId() in comments.controller`);

  const articleId = req.params.article_id;

  logger.info(`Getting comments where article_id:${articleId}`);

  // Check article_id exists
  miscService.checkValueExists('articles', 'article_id', articleId)
      .then(() => {
        return commentsModel.selectCommentsByArticleId(articleId);        
      })
      .then((comments) => {
        res.status(200).send({comments});  
      })
      .catch((err) => {
        next(err);
      });
};

const postCommentByArticleId = (req, res, next) => {
  logger.debug(`In postCommentsByArticleId() in comments.controller`);

  const articleId = req.params.article_id;
  const {username, body} = req.body;

  logger.info(`Posting comment where article_id:${articleId} and username:`
      + `${username}`);

  // Check article_id exists
  miscService.checkValueExists('articles', 'article_id', articleId)
      .then(() => {
        // Check username exists
        return miscService.checkValueExists('users', 'username', username);
      })
      .then(() => {
        return commentsModel.createComment(articleId, username, body);
      })
      .then((comment) => {
        res.status(200).send({comment});
      })
      .catch((err) => {
        next(err);
      });
};

const deleteCommentById = (req, res, next) => {
  logger.debug(`In deleteCommentById() in comments.controller`);

  const commentId = req.params.comment_id;

  logger.debug(`Deleting comment where comment_id:${commentId}`);

  commentsModel.deleteCommentById(commentId)
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        next(err);
      });
};

module.exports = {getCommentsByArticleId, postCommentByArticleId, 
    deleteCommentById};