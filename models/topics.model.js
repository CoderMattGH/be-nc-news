const db = require('../db/connection.js');

const selectTopics = () => {
  console.log("In selectTopics() in topics.model!")

  return db.query(`SELECT * FROM topics`)
    .then((topics) => {
      if (!topics.rows.length)
        return Promise.reject({status: 404, msg: 'No topics found!'});
      else 
        return topics.rows;
    });
};

module.exports = { selectTopics };