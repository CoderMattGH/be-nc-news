const commentsModel = require('../models/comments.model.js');
const miscService = require('../services/misc.service.js');

const getCommentsByArticleId = (req, res, next) => {
  console.log("In getCommentsByArticleId() in comments.controller!");

  const articleId = req.params.article_id;

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
  console.log("In postCommentsByArticleId() in comments.controller!");

  const articleId = req.params.article_id;
  const {username, body} = req.body;

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

module.exports = {getCommentsByArticleId, postCommentByArticleId};