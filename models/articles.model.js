const db = require('../db/connection.js');

const selectArticles = (topic) => {
  console.log("In selectArticles() in articles.model!");

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

  queryStr += 
      `GROUP BY articles.article_id 
        ORDER BY articles.created_at DESC;`;

  return db.query(queryStr, queryVals)
      .then(({rows: articles}) => {
          return articles;
      });
};

const selectArticleById = (articleId) => {
  console.log("In selectArticleById() in articles.model!");

  const queryStr = 
      `SELECT articles.article_id, articles.title, articles.topic,
          articles.author, articles.body, articles.created_at, articles.votes, 
          articles.article_img_url, 
          COUNT(comments.comment_id)::INT AS comment_count 
        FROM comments 
        RIGHT JOIN articles ON comments.article_id = articles.article_id 
        WHERE articles.article_id = $1 
        GROUP BY articles.article_id;`;

  return db.query(queryStr, [articleId])
      .then(({rows}) => {
        const article = rows[0];

        if (!article)
          return Promise.reject({status: 404, msg: "Resource not found!"});
        else 
          return article;
      });
};

// const selectArticleById = (articleId) => {
//   console.log("In selectArticleById() in articles.model!");

//   return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
//       .then(({rows}) => {
//         const article = rows[0];

//         if (!article)
//           return Promise.reject({status: 404, msg: "Resource not found!"});
//         else 
//           return article;
//       });
// };

const updateArticleVotesById = (articleId, voteIncrement) => {
  console.log("In updateArticleById() in articles.model!");

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