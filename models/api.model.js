const endpointsObj = require('../endpoints.json');

const selectEndpoints = () => {
  console.log("In selectEndpoints() in api.model!");

  return endpointsObj;
};

module.exports = { selectEndpoints };