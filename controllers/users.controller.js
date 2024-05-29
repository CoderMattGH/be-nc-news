const usersModel = require('../models/users.model.js');

const getAllUsers = (req, res, next) => {
  console.log("In getAllUsers() in users.controller!");

  usersModel.selectAllUsers()
      .then((users) => {
        res.status(200).send({users});
      })
      .catch((err) => {
        next(err);
      });
};

module.exports = {getAllUsers};