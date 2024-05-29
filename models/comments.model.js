const db = require('../db/connection.js');

const miscService = require('../services/misc.service.js');

const selectCommentsByArticleId = (articleId) => {
  console.log("In selectCommentsByArticleId() in comments.model!");

  return db
      .query(
          `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, 
          [articleId])
      .then(({rows: comments}) => {
        return comments;
      });
};

const createComment = (articleId, author, body) => {
  console.log("In createComment() in comments.model!");

  return db
      .query(
          `INSERT INTO comments(article_id, author, body) 
            VALUES ($1, $2, $3)
            RETURNING *;`,
          [articleId, author, body])
      .then(({rows}) => {
        return rows[0];
      });
}

module.exports = {selectCommentsByArticleId, createComment};