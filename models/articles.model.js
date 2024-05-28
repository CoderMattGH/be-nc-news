const db = require('../db/connection.js');

const selectArticleById = (articleId) => {
  console.log("In selectArticleById() in articles.model!");

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
    .then((result) => {
      const article = result.rows[0];

      if (!article)
        return Promise.reject({status: 404, msg: "Article not found!"});
      else 
        return article;
    });
};

module.exports = { selectArticleById };