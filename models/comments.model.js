const db = require('../db/connection.js');

const articlesModel = require('./articles.model.js');
const usersModel = require('./users.model.js');

const selectCommentsByArticleId = (articleId) => {
  console.log("In selectCommentsByArticleId() in comments.model!");

  // First check article is valid and exists
  return articlesModel.selectArticleById(articleId)
    .then(() => {
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

const createComment = (articleId, author, body) => {
  console.log("In createComment() in comments.model!");

  // First check article is valid and exists
  return articlesModel.selectArticleById(articleId)
      .then(() => {
        // Check username is valid and exists
        return usersModel.selectUserByUsername(author);
      })
      .then(() => {
        return db.query(
          `INSERT INTO comments(article_id, author, body) 
            VALUES ($1, $2, $3)
            RETURNING *;`,
          [articleId, author, body]
        );
      })
      .then(({rows}) => {
        return rows[0];
      })
      .catch((err) => {
        return Promise.reject(err);
      });
}

module.exports = {selectCommentsByArticleId, createComment};