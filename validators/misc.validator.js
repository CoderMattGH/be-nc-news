const logger = require('../logger/logger.js');

const validateId = (id) => {
  logger.debug(`In validateId() in misc.validator`);

  if (!((typeof id === 'number') || (id instanceof Number)) || isNaN(id))
    return {valid: false, msg: 'ID must be a number!'};    

  if (!Number.isInteger(id))
    return {valid: false, msg: 'ID must be an integer!'};

  // Id cannot be negative
  if (id < 0)
    return {valid: false, msg: 'ID cannot be negative!'};

  return {valid: true};  
};

module.exports = {validateId};