const getEndpoints = (req, res, next) => {
  console.log("In getEndpoints() in api.controller!");

  res.status(200).send(require('../endpoints.json'));
};

module.exports = {getEndpoints};