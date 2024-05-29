const db = require('../db/connection.js');

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

const deleteCommentById = (commentId) => {
  console.log("In deleteCommentById() in comments.model!");

  return db
      .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
          [commentId])
      .then(({rows}) => {
        if(!rows.length)
          return Promise.reject({status: 404, msg: 'Resource not found!'});
        else
          return rows[0];
      });
};

module.exports = {selectCommentsByArticleId, createComment, deleteCommentById};