const usersRouter = require('express').Router();

const usersController = require('../controllers/users.controller.js');

usersRouter.get('/', usersController.getAllUsers);

usersRouter.get('/:username', usersController.getUser);

module.exports = usersRouter;