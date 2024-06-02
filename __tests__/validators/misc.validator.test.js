const miscValidator = require('../../validators/misc.validator.js');

describe("validateId()", () => {
  test("Id must be a number", () => {
    expect(miscValidator.validateId("1")).toEqual(
        {valid: false, msg: 'ID must be a number!'});
  });

  test("Id must be an integer", () => {
    expect(miscValidator.validateId(2.3)).toEqual(
        {valid: false, msg: 'ID must be an integer!'});
  });  

  test("Id must be positive", () => {
    expect(miscValidator.validateId(-2)).toEqual(
        {valid: false, msg: 'ID cannot be negative!'});
  });    

  test("Returns true with a valid ID", () => {
    expect(miscValidator.validateId(30)).toEqual(
        {valid: true});
  });
});