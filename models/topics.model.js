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

module.exports = { selectTopics };