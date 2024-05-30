const articlesRouter = require('express').Router();

const articlesController = require('../controllers/articles.controller.js');

articlesRouter.get('/', articlesController.getArticles);

articlesRouter.route('/:article_id')
    .get(articlesController.getArticleById)
    .patch(articlesController.patchArticleById);

// articlesRouter.get('/:article_id', articlesController.getArticleById);

// articlesRouter.patch('/:article_id', articlesController.patchArticleById);

articlesRouter.route('/:article_id/comments')
    .get(articlesController.getCommentsByArticleId)
    .post(articlesController.postCommentByArticleId);

// articlesRouter.get('/:article_id/comments', 
//     articlesController.getCommentsByArticleId);

// articlesRouter.post('/:article_id/comments',
//     articlesController.postCommentByArticleId);

module.exports = articlesRouter;