// Require this file to parse any .env.* files
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

const logger = require('../logger/logger.js');
logger.info("Parsed env file!");