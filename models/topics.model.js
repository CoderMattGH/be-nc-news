const logger = require('../logger/logger.js');
const db = require('../db/connection.js');
const topicValidator = require('../validators/topic.validator.js');

const selectTopics = () => {
  logger.debug(`In selectTopics() in topics.model`);

  return db.query(`SELECT * FROM topics`)
      .then(({rows: topics}) => {
        if (!topics.length)
          return Promise.reject({status: 404, msg: 'Resource not found!'});
        else 
          return topics;
      });
};

const createTopic = (slug, description) => {
  logger.debug(`In createTopic() in topics.model`);
  logger.info(`Creating topic into database where slug:${slug} ` 
      + `description:${description}`);

  // Validate slug
  const slugValObj = topicValidator.validateSlug(slug);
  if (!slugValObj.valid) {
    return Promise.reject({status: 400, msg: slugValObj.msg});
  }

  // Validate description
  const descValObj = topicValidator.validateDescription(description);
  if (!descValObj.valid) {
    return Promise.reject({status: 400, msg: descValObj.msg});
  }

  return db
      .query(`INSERT INTO topics(slug, description) VALUES($1, $2) RETURNING *;`, 
          [slug, description])
      .then(({rows}) => {
        const topic = rows[0];

        return topic;
      });
};

module.exports = {selectTopics, createTopic};