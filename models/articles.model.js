const logger = require('../logger/logger.js');
const miscService = require('../services/misc.service.js');
const articleValidator = require('../validators/article.validator.js');
const userValidator = require('../validators/user.validator.js');
const topicValidator = require('../validators/topic.validator.js');
const miscValidator = require('../validators/misc.validator.js');
const db = require('../db/connection.js');

const selectArticles = (topic, sortBy = 'created_at', order = 'desc', limit = 10, 
    page = 1) => {
  logger.debug("In selectArticles() in articles.model");

  let checkTopicProm;
  if (topic !== undefined) {
    // Validate topic
    const topValObj = topicValidator.validateSlug(topic);
    if (!topValObj.valid) {
      return Promise.reject({status: 400, msg: topValObj.msg});
    }

    // Check topic exists
    checkTopicProm = miscService.checkValueExists('topics', 'slug', topic);
  } else {
    checkTopicProm = Promise.resolve();
  }

  let queryStr =
      `SELECT articles.author, articles.title, articles.article_id,
          articles.topic, articles.created_at, articles.votes, 
          articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count,
          count(*) OVER()::INT AS total_count
        FROM comments
        JOIN articles ON comments.article_id = articles.article_id `;

  const queryVals = [];

  if (topic) {
    queryVals.push(topic);
    queryStr += `WHERE articles.topic = $1 `;
  }

  queryStr += `GROUP BY articles.article_id `; 
  
  if (!['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 
      'comment_count'].includes(sortBy)) {
    return Promise.reject({status: 400, msg: "Invalid sort_by value!"});
  }

  queryStr += `ORDER BY ${sortBy} `;

  if (!['asc', 'desc'].includes(order)) {
    return Promise.reject({status: 400, msg: "Invalid order value!"});
  }

  queryStr += `${order.toUpperCase()} `;
  
  // Pagination
  queryStr += `LIMIT $${queryVals.length + 1} OFFSET $${queryVals.length + 2};`
  queryVals.push(limit);
  queryVals.push(limit * (page - 1));

  logger.info(`Selecting all articles from database where `
      + `${(topic) ? `topic:${topic} ` : ''}` 
      + `sort_by:${sortBy} order:${order} limit:${limit} page:${page}`);

  return checkTopicProm
      .then(() => {
        return db.query(queryStr, queryVals);
      })
      .then(({rows: articles}) => {
        return articles;
      });      
};

const createArticle = (author, title, body, topic, imgURL) => {
  logger.debug(`In createArticle() in articles.model`);
  logger.info(`Creating article where author:"${author}" title:"${title}" `
      + `body:"${body}" article_img_url:"${imgURL}"`);

  // Validate author
  const authorValObj = userValidator.validateUsername(author);
  if (!authorValObj.valid) {
    return Promise.reject({status: 400, msg: authorValObj.msg});
  }

  // Validate title
  const titleValObj = articleValidator.validateTitle(title);
  if (!titleValObj.valid) {
    return Promise.reject({status: 400, msg: titleValObj.msg});
  }

  // Validate body
  const bodyValObj = articleValidator.validateBody(body);
  if (!bodyValObj.valid) {
    return Promise.reject({status: 400, msg: bodyValObj.msg});
  }

  // Validate topic
  const topicValObj = topicValidator.validateSlug(topic);
  if (!topicValObj.valid) {
    return Promise.reject({status: 400, msg: topicValObj.msg});
  }

  // Validate image URL if defined
  if (imgURL !== undefined) {
    const imgValObj = articleValidator.validateImgURL(imgURL);
    if (!imgValObj.valid) {
      return Promise.reject({status: 400, msg: imgValObj.msg});
    }
  }

  const valMap = new Map();
  valMap.set('author', author);
  valMap.set('title', title);
  valMap.set('body', body);
  valMap.set('topic', topic);

  if (imgURL)
    valMap.set('article_img_url', imgURL);

  // Add $1, $2, $3, etc.
  const countArr = [];
  Array.from(valMap.keys())
      .forEach((val, index) => countArr.push(`$${++index}`));

  let queryStr = 
      `INSERT INTO articles(${Array.from(valMap.keys()).join()}) 
        VALUES(${countArr.join()})
        RETURNING *;`;

  return db.query(queryStr, Array.from(valMap.values())).
      then(({rows}) => {
        const article = rows[0];

        return article;
      });
};

const selectArticleById = (articleId) => {
  logger.debug("In selectArticleById() in articles.model");

  // Validate article ID
  const idValObj = miscValidator.validateId(articleId);
  if (!idValObj.valid) {
    return Promise.reject({status: 400, msg: idValObj.msg});
  }

  const queryStr = 
      `SELECT articles.article_id, articles.title, articles.topic,
          articles.author, articles.body, articles.created_at, articles.votes, 
          articles.article_img_url, 
          COUNT(comments.comment_id)::INT AS comment_count 
        FROM comments 
        RIGHT JOIN articles ON comments.article_id = articles.article_id 
        WHERE articles.article_id = $1 
        GROUP BY articles.article_id;`;

  logger.info(`Selecting article from database where article_id:${articleId}`);

  return db.query(queryStr, [articleId])
      .then(({rows}) => {
        const article = rows[0];

        if (!article)
          return Promise.reject({status: 404, msg: "Article not found!"});
        else 
          return article;
      });
};

const deleteArticleById = (articleId) => {
  logger.debug(`In deleteArticleById() in articles.model`);
  logger.info(`Deleting article where article_id=${articleId}`);

  // Validate article ID
  const idValObj = miscValidator.validateId(articleId);
  if (!idValObj.valid) {
    return Promise.reject({status: 400, msg: idValObj.msg});
  }

  return db
      .query(`DELETE FROM articles WHERE article_id = $1 RETURNING *;`, 
          [articleId])
      .then(({rows}) => {
        const article = rows[0];

        if (!article)
          return Promise.reject({status:404, msg:'Article not found!'});
        else 
          return article;
      });
};

const updateArticleVotesById = (articleId, voteIncrement) => {
  logger.debug(`In updateArticleById() in articles.model`);
  logger.info(`Updating article in database where article_id:${articleId}`
      + ` with vote_increment:${voteIncrement}`);

  // Validate article ID
  const idValObj = miscValidator.validateId(articleId);
  if (!idValObj.valid) {
    return Promise.reject({status: 400, msg: idValObj.msg});
  }

  // Validate votes
  const voteValObj = articleValidator.validateVote(voteIncrement);
  if (!voteValObj.valid) {
    return Promise.reject({status: 400, msg: voteValObj.msg});
  }

  return db
      .query(
          `UPDATE articles SET votes = GREATEST(votes + $1, 0) 
            WHERE article_id = $2 
            RETURNING *;`,
          [voteIncrement, articleId])
      .then(({rows}) => {
        const article = rows[0];

        if (!article)
          return Promise.reject({status: 404, msg: "Article not found!"});
        else
          return article;
      });
};

module.exports = {selectArticles, selectArticleById, updateArticleVotesById,
    createArticle, deleteArticleById};