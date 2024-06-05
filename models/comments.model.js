const logger = require('../logger/logger.js');
const db = require('../db/connection.js');
const miscService = require('./misc.model.js');
const miscValidator = require('../validators/misc.validator.js');
const commentValidator = require('../validators/comment.validator.js');
const userValidator = require('../validators/user.validator.js');

const selectCommentsByArticleId = (articleId, limit = 10, page = 1) => {
  logger.debug(`In selectCommentsByArticleId() in comments.model`);
  logger.info(`Selecting comments from database where article_id:${articleId} `
      + `limit=${limit} page=${page}`);

  // Validate article ID
  const idValObj = miscValidator.validateId(articleId);
  if (!idValObj.valid) {
    return Promise.reject({status: 400, msg: idValObj.msg});
  }

  const queryStr = 
      `SELECT * FROM comments 
        WHERE article_id = $1 
        ORDER BY created_at DESC 
        LIMIT $2 OFFSET $3;`; 

  return miscService.checkValueExists('articles', 'article_id', articleId)
      .then(() => {
        return db.query(queryStr, [articleId, limit, (page - 1) * limit]);
      })
      .then(({rows: comments}) => {
        return comments;
      });
};

const createComment = (articleId, author, body) => {
  logger.debug(`In createComment() in comments.model`);
  logger.info(`Inserting comment into database where article_id:${articleId} `
      + `author:${author}`);

  // Validate article ID
  const idValObj = miscValidator.validateId(articleId);
  if (!idValObj.valid) {
    return Promise.reject({status: 400, msg: idValObj.msg});
  }
  
  // Validate author
  const userValObj = userValidator.validateUsername(author);
  if (!userValObj.valid) {
    return Promise.reject({status: 400, msg: userValObj.msg});
  }

  // Validate body
  const bodyValObj = commentValidator.validateBody(body);
  if (!bodyValObj.valid) {
    return Promise.reject({status: 400, msg: bodyValObj});
  }

  // Check article ID exists
  const artProm = miscService.checkValueExists('articles', 'article_id', articleId);
  // Check username exists
  const userProm = miscService.checkValueExists('users', 'username', author);

  const promArr = [];
  promArr.push(artProm);
  promArr.push(userProm);

  return Promise.all(promArr)
      .then(() => {
        return db.query(
            `INSERT INTO comments(article_id, author, body) 
              VALUES ($1, $2, $3)
              RETURNING *;`,
            [articleId, author, body])
      })
      .then(({rows}) => {
        return rows[0];
      });
}

const deleteCommentById = (commentId) => {
  logger.debug(`In deleteCommentById() in comments.model`);
  logger.info(`Deleting comment from database where comment_id:${commentId}`);

  // Validate ID
  const idValObj = miscValidator.validateId(commentId);
  if (!idValObj.valid) {
    return Promise.reject({status: 400, msg: idValObj.msg});
  }  

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
  
  // Validate ID
  const idValObj = miscValidator.validateId(commentId);
  if (!idValObj.valid) {
    return Promise.reject({status: 400, msg: idValObj.msg});
  }

  // Validate votes
  const voteValObj = commentValidator.validateVote(incVotes);
  if (!voteValObj.valid) {
    return Promise.reject({status: 400, msg: voteValObj.msg});
  }

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