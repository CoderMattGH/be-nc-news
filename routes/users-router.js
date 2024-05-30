const usersRouter = require('express').Router();

const usersController = require('../controllers/users.controller.js');

usersRouter.get('/', usersController.getAllUsers);

module.exports = usersRouter;