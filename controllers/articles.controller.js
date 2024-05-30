const logger = require('../logger/logger.js');
const articlesModel = require('../models/articles.model.js');
const commentsModel = require('../models/comments.model.js');
const miscService = require('../services/misc.service.js');

const getArticles = (req, res, next) => {
  logger.debug(`In getArticles() in articles.controller`);

  const {topic, sort_by: sortBy} = req.query;

  const promiseArr = [];

  // If a topic is specified, check it exists.
  if (topic) {
    const checkValProm = miscService.checkValueExists('topics', 'slug', topic);
    promiseArr.push(checkValProm);
  }

  const articlesProm = articlesModel.selectArticles(topic, sortBy);
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

const getCommentsByArticleId = (req, res, next) => {
  logger.debug(`In getCommentsByArticleId() in articles.controller`);

  const articleId = req.params.article_id;

  logger.info(`Getting comments where article_id:${articleId}`);

  // Check article_id exists
  miscService.checkValueExists('articles', 'article_id', articleId)
      .then(() => {
        return commentsModel.selectCommentsByArticleId(articleId);        
      })
      .then((comments) => {
        res.status(200).send({comments});  
      })
      .catch((err) => {
        next(err);
      });
};

const postCommentByArticleId = (req, res, next) => {
  logger.debug(`In postCommentsByArticleId() in articles.controller`);

  const articleId = req.params.article_id;
  const {username, body} = req.body;

  logger.info(`Posting comment where article_id:${articleId} and username:`
      + `${username}`);

  // Check article_id exists
  miscService.checkValueExists('articles', 'article_id', articleId)
      .then(() => {
        // Check username exists
        return miscService.checkValueExists('users', 'username', username);
      })
      .then(() => {
        return commentsModel.createComment(articleId, username, body);
      })
      .then((comment) => {
        res.status(200).send({comment});
      })
      .catch((err) => {
        next(err);
      });
};

module.exports = {getArticles, getArticleById, patchArticleById, 
    getCommentsByArticleId, postCommentByArticleId};