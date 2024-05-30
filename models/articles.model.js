const logger = require('../logger/logger.js');
const db = require('../db/connection.js');

const selectArticles = (topic, sortBy = 'created_at') => {
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

  // queryStr += `ORDER BY articles.created_at DESC;`;
  queryStr += `ORDER BY ${sortBy} DESC;`;

  logger.info(`Selecting all articles from database `
      + `${(topic) ? `where topic:${topic}` : ''} sort_by:${sortBy}`);

  return db.query(queryStr, queryVals)
      .then(({rows: articles}) => {
        return articles;
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

module.exports = {selectArticles, selectArticleById, updateArticleVotesById};