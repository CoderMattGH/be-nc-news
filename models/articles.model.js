const db = require('../db/connection.js');

const selectArticles = () => {
  console.log("In selectArticles() in articles.model!");

  const queryStr =
    `SELECT articles.author, articles.title, articles.article_id,
        articles.topic, articles.created_at, articles.votes, 
        articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
      FROM comments
      JOIN articles ON comments.article_id = articles.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;`;

  return db
    .query(queryStr)
    .then(({rows: articles}) => {
      if (!articles.length)
        return Promise.reject({status: 404, msg: "Articles not found!"});
      else
        return articles;
    });
};

const selectArticleById = (articleId) => {
  console.log("In selectArticleById() in articles.model!");

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
    .then(({rows}) => {
      const article = rows[0];

      if (!article)
        return Promise.reject({status: 404, msg: "Article not found!"});
      else 
        return article;
    });
};

module.exports = {selectArticles, selectArticleById};