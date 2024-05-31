const logger = require('../logger/logger.js');
const db = require('../db/connection.js');

const selectTopics = () => {
  logger.debug(`In selectTopics() in topics.model`);

  return db.query(`SELECT * FROM topics`)
      .then((topics) => {
        if (!topics.rows.length)
          return Promise.reject({status: 404, msg: 'Resource not found!'});
        else 
          return topics.rows;
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
        return rows[0];
      });
};

module.exports = {selectTopics, createTopic};