const logger = require('../logger/logger.js');

const validateImgURL = (imgURL) => {
  logger.debug(`In validateImgURL in article.validator`);

  if (!((typeof imgURL === 'string') || (imgURL instanceof String)))
    return {valid: false, msg: 'Image URL must be a string!'};

  if (!imgURL.trim().length)
    return {valid: false, msg: 'Image URL cannot be empty!'};

  try {
    new URL(imgURL);
  } catch(err) {
    return {valid: false, msg: 'Image URL must be a valid URL!'};
  }

  return {valid: true};
};

const validateTitle = (title) => {
  logger.debug(`In validateTitle in article.validator`);

  if (!((typeof title === 'string') || (title instanceof String)))
    return {valid: false, msg: 'Title must be a string!'};

  if (!title.trim().length)
    return {valid: false, msg: 'Title cannot be empty!'};

  // Title should not start with a space or end with a space
  if(title.trim().length !== title.length)
    return {valid: false, msg: 'Title cannot start or end with spaces!'};

  // Title should only contain numbers, letters, and spaces
  const pattern = /^[a-z0-9 ]+$/i;
  if (!pattern.test(title))
    return {valid: false, msg: 'Title contains invalid characters!'};

  // Title should be a maximum length of 130 characters
  if (title.length > 130)
    return {valid: false, msg: 'Title cannot be longer than 130 characters!'};

  return {valid: true};
};

const validateBody = (body) => {
  logger.debug(`In validateBody in article.validator`);

  if (!((typeof body === 'string') || (body instanceof String)))
    return {valid: false, msg: 'Body must be a string!'};  

  if (!body.trim().length)
    return {valid: false, msg: 'Body cannot be empty!'};

  // Body should not start with a space or end with a space
  if(body.trim().length !== body.length)
    return {valid: false, msg: 'Body cannot start or end with spaces!'};  

  // Body should be a maximum of 20000 characters
  if (body.length > 20000)
    return {valid: false, msg: 'Body cannot be longer than 20000 characters!'};

  return {valid: true};
};

const validateVote = (vote) => {
  logger.debug(`In validateVote() in article.validator`);

  if (!((typeof vote === 'number') || (vote instanceof Number)) || isNaN(vote))
    return {valid: false, msg: 'Vote must be a number!'};    

  if (!Number.isInteger(vote))
    return {valid: false, msg: 'Vote must be an integer!'};

  return {valid: true};
};

module.exports = {validateImgURL, validateTitle, validateBody, validateVote};