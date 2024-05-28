const express = require('express');
const app = express();

const topicsController = require('./controllers/topics.controller.js');

app.get('/api/topics', topicsController.getTopics);

// Handle psql errors
app.use((err, req, res, next) => {
  console.log("In psql error handler!");

  if (err.code) {
    res.status(500).send({msg: 'An unknown error occurred!'});
  } else {
    // Pass on to next error handler
    next(err);
  }
});

// Handle misc. errors
app.use((err, req, res, next) => {
  console.log("In misc. error handler!");

  if (err.status === 404) {
    res.status(404).send({msg: err.msg});
  }
});

module.exports = app;