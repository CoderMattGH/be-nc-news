const logger = require('../logger/logger.js');
const db = require('../db/connection.js');

const selectCommentsByArticleId = (articleId, limit = 10, page = 1) => {
  logger.debug(`In selectCommentsByArticleId() in comments.model`);
  logger.info(`Selecting comments from database where article_id:${articleId} `
      + `limit=${limit} page=${page}`);

  const queryStr = 
      `SELECT * FROM comments 
        WHERE article_id = $1 
        ORDER BY created_at DESC 
        LIMIT $2 OFFSET $3;`; 

  return db.query(queryStr, [articleId, limit, (page - 1) * limit])
      .then(({rows: comments}) => {
        return comments;
      });
};

const createComment = (articleId, author, body) => {
  logger.debug(`In createComment() in comments.model`);
  logger.info(`Inserting comment into database where article_id:${articleId} `
      + `author:${author}`);

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
  logger.debug(`In deleteCommentById() in comments.model`);
  logger.info(`Deleting comment from database where comment_id:${commentId}`);

  return db
      .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
          [commentId])
      .then(({rows}) => {
        const comment = rows[0];

        if(!comment)
          return Promise.reject({status: 404, msg: 'Resource not found!'});
        else
          return comment;
      });
};

const increaseVoteByCommentId = (commentId, incVotes) => {
  logger.debug(`In increaseVoteByCommentId() in comments.model`);
  logger.debug(`Changing vote count on comment where comment_id:${commentId}`
      + ` with vote_increment:${incVotes}`);
  
  return db
      .query(
          `UPDATE comments 
            SET votes = votes + $1 
            WHERE comment_id = $2 
            RETURNING *;`,
          [incVotes, commentId])
      .then(({rows}) => {
        const comment = rows[0];

        if (!comment)
          return Promise.reject({status: 404, msg: "Resource not found!"});
        else
          return comment;
      });
};

module.exports = {selectCommentsByArticleId, createComment, deleteCommentById,
    increaseVoteByCommentId};