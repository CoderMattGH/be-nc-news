const logger = require('../logger/logger.js');

const validateSlug = (slug) => {
  logger.debug(`In validateSlug in topic.validator`);

  if (!(typeof slug === 'string') || (slug instanceof String))
    return {valid: false, msg: 'Slug must be a string!'};

  if (!slug.trim().length)
    return {valid: false, msg: 'Slug cannot be empty!'};  

  // Slug should only contain letters and no spaces
  const pattern = /^[a-z]+$/i;
  if (!pattern.test(slug))
    return {valid: false, msg: 'Slug contains invalid characters!'};

  // Slug should be a maximum length of 30 characters
  if (slug.length > 30)
      return {valid: false, msg: 'Slug cannot be longer than 30 characters'};

  return {valid: true};
};

const validateDescription = (description) => {
  logger.debug(`In validateDescription in topic.validator`);

  if (!(typeof description === 'string') || (description instanceof String))
    return {valid: false, msg: 'Description must be a string!'};

  if (!description.trim().length)
    return {valid: false, msg: 'Description cannot be empty!'};  

  // Description should not start with a space or end with a space
  if (description.trim().length !== description.length)
    return {valid: false, msg: 'Description cannot start or end with spaces!'};

  // Description should only contain letters, numbers and spaces
  const pattern = /^[a-z0-9 ]+$/i;
  if(!pattern.test(description))
    return {valid: false, msg: 'Description contains invalid characters!'};

  // Description should be a maximum length of 130 characters
  if (description.length > 130)
    return {valid: false, 
        msg: 'Description should be a maximum length of 130 characters!'};
  
  return {valid: true};
};

module.exports = {validateDescription, validateSlug};