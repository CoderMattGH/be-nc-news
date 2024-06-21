const logger = require('../logger/logger.js');
const articlesModel = require('../models/articles.model.js');
const commentsModel = require('../models/comments.model.js');

const getArticles = (req, res, next) => {
  logger.debug(`In getArticles() in articles.controller`);

  const {topic, sort_by: sortBy, order, limit, p: page} = req.query;

  articlesModel.selectArticles(topic, sortBy, order, limit, page)
      .then((articles) => {
        res.status(200).send({articles});
      })
      .catch((err) => {
        next(err);
      });
};

const postArticle = (req, res, next) => {
  logger.debug(`In postArticle() in articles.controller`);

  const {author, title, body, topic, article_img_url: imgURL} = req.body;

  articlesModel.createArticle(author, title, body, topic, imgURL)
      .then((article) => {
        // Add comment_count property
        article.comment_count = 0;

        res.status(200).send({article});
      })
      .catch((err) => {
        next(err);
      });
};

const deleteArticle = (req, res, next) => {
  logger.debug(`In deleteArticle() in articles.controller`);

  const articleId = Number(req.params.article_id);

  articlesModel.deleteArticleById(articleId)
      .then(() => {
        // Return an empty object
        res.status(204).send();
      })
      .catch((err) => {
        next(err);
      });
};

const getArticleById = (req, res, next) => {
  logger.debug(`In getArticleById() in articles.controller`);
  
  const articleId = Number(req.params.article_id);

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
  
  const articleId = Number(req.params.article_id);
  const voteIncrement = Number(req.body.inc_votes);
  
  logger.info(`Patching article where article_id:${articleId} with vote_inc:`
      + `${voteIncrement}`);

  if(!voteIncrement)
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

  const {limit, p: page} = req.query;
  const articleId = Number(req.params.article_id);

  logger.info(`Getting comments where article_id:${articleId}`);

  commentsModel.selectCommentsByArticleId(articleId, limit, page)
      .then((comments) => {
        res.status(200).send({comments});  
      })
      .catch((err) => {
        next(err);
      });
};

const postCommentByArticleId = (req, res, next) => {
  logger.debug(`In postCommentsByArticleId() in articles.controller`);

  const articleId = Number(req.params.article_id);
  const {username, body} = req.body;

  logger.info(`Posting comment where article_id:${articleId} and username:`
      + `${username}`);

  commentsModel.createComment(articleId, username, body)
      .then((comment) => {
        res.status(200).send({comment});
      })
      .catch((err) => {
        next(err);
      });
};

module.exports = {getArticles, getArticleById, patchArticleById, 
    getCommentsByArticleId, postCommentByArticleId, postArticle, deleteArticle};