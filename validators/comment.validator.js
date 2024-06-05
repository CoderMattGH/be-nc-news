const logger = require('../logger/logger.js');

const validateBody = (body) => {
  logger.debug(`In validateBody in comment.validator`);

  if (!((typeof body === 'string') || (body instanceof String)))
    return {valid: false, msg: 'Body must be a string!'};  

  if (!body.trim().length)
    return {valid: false, msg: 'Body cannot be empty!'};

  // Body should not start with a space or end with a space
  if(body.trim().length !== body.length)
    return {valid: false, msg: 'Body cannot start or end with spaces!'};  

  // Body should be a maximum of 10000 characters
  if (body.length > 10000)
    return {valid: false, msg: 'Body cannot be longer than 10000 characters!'};

  return {valid: true};  
};

const validateVote = (vote) => {
  logger.debug(`In validateVote() in comment.validator`);

  if (!((typeof vote === 'number') || (vote instanceof Number)) || isNaN(vote))
    return {valid: false, msg: 'Vote must be a number!'};    

  if (!Number.isInteger(vote))
    return {valid: false, msg: 'Vote must be an integer!'};

  return {valid: true};  
};

module.exports = {validateBody, validateVote};