const apiModel = require('../models/api.model.js');

const getEndpoints = (req, res, next) => {
  console.log("In getEndpoints() in api.controller!");

  const endpointsObj = apiModel.selectEndpoints();

  res.status(200).send(endpointsObj);
};

module.exports = { getEndpoints };