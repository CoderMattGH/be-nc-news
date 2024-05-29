const logger = require('../logger/logger.js');
const db = require('../db/connection.js');

const selectUserByUsername = (username) => {
  logger.debug(`In selectUserByUsername() in users.model`);
  logger.info(`Selecting user from database where username:${username}`);

  return db.query(`SELECT * FROM users WHERE username = $1`, [username])
      .then(({rows}) => {
        if (!rows.length)
          return Promise.reject({status: 404, msg: 'Resource not found!'});
        else
          return rows[0];
      })
      .catch((err) => {
        return Promise.reject(err);
      });
};

const selectAllUsers = () => {
  logger.debug(`In selectAllUsers() in users.model`);

  return db.query(`SELECT username, name, avatar_url FROM users;`)
      .then(({rows: users}) => {
        return users;
      });
};

module.exports = {selectUserByUsername, selectAllUsers};