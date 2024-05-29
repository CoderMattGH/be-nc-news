const db = require('../db/connection.js');

const selectUserByUsername = (username) => {
  console.log("In selectUserByUsername() in users.model!");

  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({rows}) => {
      // TODO: Exposing username information
      if (!rows.length)
        return Promise.reject({status: 404, msg: 'Username not found!'});
      else
        return rows[0];
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

module.exports = {selectUserByUsername};