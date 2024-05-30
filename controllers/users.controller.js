const logger = require(`../logger/logger.js`);
const usersModel = require('../models/users.model.js');

const getAllUsers = (req, res, next) => {
  logger.debug(`In getAllUsers() in users.controller`);

  usersModel.selectAllUsers()
      .then((users) => {
        res.status(200).send({users});
      })
      .catch((err) => {
        next(err);
      });
};

const getUser = (req, res, next) => {
  logger.debug(`In getUser() in users.controller`);

  const username = req.params.username;

  usersModel.selectUserByUsername(username)
      .then((user) => {
        res.status(200).send({user});
      })
      .catch((err) => {
        next(err);
      });
};

module.exports = {getAllUsers, getUser};