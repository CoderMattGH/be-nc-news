const articlesModel = require('../models/articles.model.js');

const getArticleById = (req, res, next) => {
  console.log("In getArticleById() in articles.controller!");

  const articleId = req.params.article_id;

  articlesModel.selectArticleById(articleId)
    .then((article) => {
      res.status(200).send({article: article});
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticleById };