const articlesModel = require('../models/articles.model.js');

const getArticles = (req, res, next) => {
  console.log("In getArticles() in articles.controller!");

  articlesModel.selectArticles()
    .then((articles) => {
      res.status(200).send({articles});
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleById = (req, res, next) => {
  console.log("In getArticleById() in articles.controller!");

  const articleId = req.params.article_id;

  articlesModel.selectArticleById(articleId)
    .then((article) => {
      res.status(200).send({article});
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {getArticles, getArticleById};