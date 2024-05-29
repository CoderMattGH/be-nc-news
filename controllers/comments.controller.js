const commentsModel = require('../models/comments.model.js');

const getCommentsByArticleId = (req, res, next) => {
  console.log("In getCommentsByArticleId() in comments.controller!");

  const articleId = req.params.article_id;
  commentsModel.selectCommentsByArticleId(articleId)
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

  commentsModel.createComment(articleId, username, body)
    .then((comment) => {
      res.status(200).send({comment});
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {getCommentsByArticleId, postCommentByArticleId};