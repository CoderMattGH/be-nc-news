require('./env-parser/env-parser.js');
const logger = require('./logger/logger.js');

const express = require('express');
const app = express();

const cors = require('cors');
const apiRouter = require('./routes/api-router.js');

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

// Handle psql errors
app.use((err, req, res, next) => {
  logger.debug("In psql error handler");

  if(err.code === '22P02' || err.code === '23502' || err.code === '2201X'
      || err.code === '2201W')
    res.status(400).send({msg: 'Bad request!'})
  else if(err.code === '23503')   // Violates Foreign Key constraint
    res.status(404).send({msg: 'Resource not found!'})  
  else if(err.code === '23505')   // Duplicate Primary Key found
    res.status(409).send({msg: 'Resource already exists!'});
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