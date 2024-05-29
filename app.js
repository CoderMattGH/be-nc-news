const express = require('express');
const app = express();

const apiController = require('./controllers/api.controller.js');
const topicsController = require('./controllers/topics.controller.js');
const articlesController = require('./controllers/articles.controller.js');
const commentsController = require('./controllers/comments.controller.js');

app.use(express.json());

app.get('/api', apiController.getEndpoints);

app.get('/api/topics', topicsController.getTopics);

app.get('/api/articles', articlesController.getArticles);

app.get('/api/articles/:article_id', articlesController.getArticleById);

app.get('/api/articles/:article_id/comments', 
    commentsController.getCommentsByArticleId);

app.post('/api/articles/:article_id/comments',
    commentsController.postCommentByArticleId);

// Handle psql errors
app.use((err, req, res, next) => {
  console.log("In psql error handler!");

  if(err.code === '22P02')
    res.status(400).send({msg: 'Bad request!'})
  else
    next(err);
});

// Handle misc. errors
app.use((err, req, res, next) => {
  console.log("In misc. error handler!");

  if (err.status && err.msg)
    res.status(err.status).send({msg: err.msg});
  else
    next(err);
});

module.exports = app;