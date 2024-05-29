const logger = require('../logger/logger.js');

const getEndpoints = (req, res, next) => {
  logger.debug("In getEndpoints() in api.controller");

  res.status(200).send(require('../endpoints.json'));
};

module.exports = {getEndpoints};