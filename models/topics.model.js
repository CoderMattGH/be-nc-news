const logger = require('../logger/logger.js');
const db = require('../db/connection.js');

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

  return db
      .query(`INSERT INTO topics(slug, description) VALUES($1, $2) RETURNING *;`, 
          [slug, description])
      .then(({rows}) => {
        const topic = rows[0];

        return topic;
      });
};

module.exports = {selectTopics, createTopic};