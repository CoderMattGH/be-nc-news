const db = require('../db/connection.js');

const articlesModel = require('./articles.model.js');

const selectCommentsByArticleId = (articleId) => {
  console.log("In selectCommentsByArticleId() in comments.model!");

  // First check article is valid and exists
  return articlesModel.selectArticleById(articleId)
    .then(() => {   // Article exists!
      return db.query(
          `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, 
          [articleId]);
    })
    .then(({rows: comments}) => {
      return comments;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

module.exports = {selectCommentsByArticleId};