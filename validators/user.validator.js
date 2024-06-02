const logger = require('../logger/logger.js');

const validateUsername = (username) => {
  logger.debug(`In validateUsername in user.validator`);

  if (!(typeof username === 'string') || (username instanceof String))
    return {valid: false, msg: 'Username must be a string!'};

  if (!username.trim().length)
    return {valid: false, msg: 'Username cannot be empty!'};

  // Username should contain only numbers and letters
  const pattern = /^[a-z0-9_]+$/i;
  if (!pattern.test(username))
    return {valid: false, msg: 'Username contains invalid characters!'};

  // Username should be a maximum length of 25 characters
  if (username.length > 25)
    return {valid: false, msg: 'Username cannot be longer than 25 characters!'};

  // Username should be a minimum length of 5 characters
  if (username.length < 5)
    return {valid: false, msg: 'Username cannot be shorter than 5 characters!'};

  return {valid: true};
}; 

const validateName = (name) => {
  logger.debug(`In validateName in user.validator`);

  if (!(typeof name === 'string') || (name instanceof String))
    return {valid: false, msg: 'Name must be a string!'};

  if (!name.trim().length)
    return {valid: false, msg: 'Name cannot be empty!'};

  // Should not start or end with spaces
  if (name.trim().length !== name.length)
    return {valid: false, msg: 'Name cannot start or end with a space!'};

  // Name should contain only letters
  const pattern = /^[a-z ]+$/i;
  if (!pattern.test(name))
    return {valid: false, msg: 'Name contains invalid characters!'}; 
  
  // Name should be a minimum of 5 characters
  if (name.length < 5)
    return {valid: false, msg: "Name cannot be shorter than 5 characters!"};

  if (name.length > 130)
    return {valid: false, msg: "Name cannot be longer than 130 characters!"}

  return {valid: true};
};

const validateAvatarURL = (avatarURL) => {
  logger.debug('In validateAvatarURL in user.validator');

  if (!(typeof avatarURL === 'string') || (avatarURL instanceof String))
    return {valid: false, msg: 'Avatar URL must be a string!'};

  if (!avatarURL.trim().length)
    return {valid: false, msg: 'Avatar URL cannot be empty!'};

  try {
    new URL(avatarURL);
  } catch (err) {
    return {valid: false, msg: 'Avatar URL is an invalid URL!'}
  }

  return {valid: true};
};

module.exports = {validateUsername, validateName, validateAvatarURL};