require('./env-parser/env-parser.js');
const logger = require('./logger/logger.js');

const express = require('express');
const app = express();

const apiRouter = require('./routes/api-router.js');

const articlesController = require('./controllers/articles.controller.js');

app.use(express.json());

app.use('/api', apiRouter);

app.get('/api/articles', articlesController.getArticles);

app.get('/api/articles/:article_id', articlesController.getArticleById);

app.patch('/api/articles/:article_id', articlesController.patchArticleById);

app.get('/api/articles/:article_id/comments', 
    articlesController.getCommentsByArticleId);

app.post('/api/articles/:article_id/comments',
    articlesController.postCommentByArticleId);

// Handle psql errors
app.use((err, req, res, next) => {
  logger.debug("In psql error handler");

  if(err.code === '22P02')
    res.status(400).send({msg: 'Bad request!'})
  else
    next(err);
});

// Handle misc. errors
app.use((err, req, res, next) => {
  logger.debug("In misc. error handler");

  if (err.status && err.msg)
    res.status(err.status).send({msg: err.msg});
  else
    next(err);
});

module.exports = app;