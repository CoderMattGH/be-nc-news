const commentValidator = require('../../validators/comment.validator.js');

describe("validateBody()", () => {
  test("Body should not be undefined", () => {
    expect(commentValidator.validateBody()).toEqual(
        {valid: false, msg: 'Body must be a string!'});
  });

  test("Body should not be an empty string", () => {
    expect(commentValidator.validateBody("")).toEqual(
        {valid: false, msg: 'Body cannot be empty!'});
  });  

  test("Body should not just be spaces", () => {
    expect(commentValidator.validateBody("  ")).toEqual(
        {valid: false, msg: 'Body cannot be empty!'});
  });    

  test("Body should have a maximum length of 10000 characters", () => {
    let commentLong = "";
    for(let i = 0; i < 10100; i++)
      commentLong += "T";

    expect(commentValidator.validateBody(commentLong)).toEqual(
        {valid: false, msg: 'Body cannot be longer than 10000 characters!'});
  });  

  test("Valid comment should return true", () => {
    expect(commentValidator.validateBody("This is a valid comment!")).toEqual(
        {valid: true});
  });    
});

describe("validateVote()", () => {
  test("Vote cannot be undefined", () => {
    expect(commentValidator.validateVote()).toEqual(
        {valid: false, msg: 'Vote must be a number!'});
  });

  test("Vote must be a number", () => {
    expect(commentValidator.validateVote("22")).toEqual(
        {valid: false, msg: 'Vote must be a number!'});
  });

  test("Vote must be an integer", () => {
    expect(commentValidator.validateVote(22.3)).toEqual(
        {valid: false, msg: 'Vote must be an integer!'});
  });  

  test("A valid vote returns true", () => {
    expect(commentValidator.validateVote(33)).toEqual(
        {valid: true});
  });  

  test("A vote can be negative", () => {
    expect(commentValidator.validateVote(-20)).toEqual(
        {valid: true});
  });
});