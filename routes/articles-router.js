const articlesRouter = require('express').Router();

const articlesController = require('../controllers/articles.controller.js');

articlesRouter.get('/', articlesController.getArticles);

articlesRouter.get('/:article_id', articlesController.getArticleById);

articlesRouter.patch('/:article_id', articlesController.patchArticleById);

articlesRouter.get('/:article_id/comments', 
    articlesController.getCommentsByArticleId);

articlesRouter.post('/:article_id/comments',
    articlesController.postCommentByArticleId);

module.exports = articlesRouter;