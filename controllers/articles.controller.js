const logger = require('../logger/logger.js');
const articlesModel = require('../models/articles.model.js');
const miscService = require('../services/misc.service.js');

const getArticles = (req, res, next) => {
  logger.debug(`In getArticles() in articles.controller`);

  const topic = req.query.topic;

  const promiseArr = [];

  // If a topic is specified, check it exists.
  if (topic) {
    const checkValProm = miscService.checkValueExists('topics', 'slug', topic);
    promiseArr.push(checkValProm);
  }

  const articlesProm = articlesModel.selectArticles(topic);
  promiseArr.push(articlesProm);

  Promise.all(promiseArr)
      .then(() => {
        return articlesProm;
      })
      .then((articles) => {
        res.status(200).send({articles});
      })
      .catch((err) => {
        next(err);
      });
};

const getArticleById = (req, res, next) => {
  logger.debug(`In getArticleById() in articles.controller`);
  
  const articleId = req.params.article_id;

  logger.info(`Fetching article where article_id:${articleId}`);

  articlesModel.selectArticleById(articleId)
      .then((article) => {
        res.status(200).send({article});
      })
      .catch((err) => {
        next(err);
      });
};

const patchArticleById = (req, res, next) => {
  logger.debug(`In patchArticleById() in articles.controller`);
  
  const articleId = req.params.article_id;
  const voteIncrement = req.body.inc_votes;
  
  logger.info(`Patching article where article_id:${articleId} with vote_inc:`
      + `${voteIncrement}`);

  if(voteIncrement === undefined)
    next({status: 400, msg: "Bad request!"});

  return articlesModel.updateArticleVotesById(articleId, voteIncrement)
      .then((article) => {
        res.status(200).send({article});
      })
      .catch((err) => {
        next(err);
      });
};

module.exports = {getArticles, getArticleById, patchArticleById};