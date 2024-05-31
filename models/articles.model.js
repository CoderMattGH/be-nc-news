const logger = require('../logger/logger.js');
const db = require('../db/connection.js');

const selectArticles = (topic, sortBy = 'created_at', order = 'desc',
    limit = 10, page = 1) => {
  logger.debug("In selectArticles() in articles.model");

  let queryStr =
      `SELECT articles.author, articles.title, articles.article_id,
          articles.topic, articles.created_at, articles.votes, 
          articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
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
    return Promise.reject({status: 400, msg: "Bad request!"});
  }

  queryStr += `ORDER BY ${sortBy} `;

  if (!['asc', 'desc'].includes(order)) {
    return Promise.reject({status: 400, msg: "Bad request!"});
  }

  queryStr += `${order.toUpperCase()} `;
  
  // Pagination
  queryStr += `LIMIT $${queryVals.length + 1} OFFSET $${queryVals.length + 2};`
  queryVals.push(limit);
  queryVals.push(limit * (page - 1));

    logger.info(`Selecting all articles from database where `
      + `${(topic) ? `topic:${topic} ` : ''}` 
      + `sort_by:${sortBy} order:${order} limit:${limit} page:${page}`);

  return db.query(queryStr, queryVals)
      .then(({rows: articles}) => {
        return articles;
      });
};

const createArticle = (author, title, body, topic, imgURL) => {
  logger.debug(`In createArticle() in articles.model`);
  logger.info(`Creating article where author:"${author}" title:"${title}" `
      + `body:"${body}" article_img_url:"${imgURL}"`);

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
        return rows[0];
      });
};

const selectArticleById = (articleId) => {
  logger.debug("In selectArticleById() in articles.model");

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
          return Promise.reject({status: 404, msg: "Resource not found!"});
        else 
          return article;
      });
};

const updateArticleVotesById = (articleId, voteIncrement) => {
  logger.debug(`In updateArticleById() in articles.model`);
  logger.info(`Updating article in database where article_id:${articleId}`
      + ` with vote_increment:${voteIncrement}`);

  return db
      .query(
          `UPDATE articles SET votes = GREATEST(votes + $1, 0) 
            WHERE article_id = $2 
            RETURNING *;`,
          [voteIncrement, articleId])
      .then(({rows}) => {
        const article = rows[0];

        if (!article)
          return Promise.reject({status: 404, msg: "Resource not found!"});
        else
          return article;
      });
};

module.exports = {selectArticles, selectArticleById, updateArticleVotesById,
    createArticle};