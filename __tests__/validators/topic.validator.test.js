const topicValidator = require('../../validators/topic.validator.js');

describe("validateSlug()", () => {
  test("Slug cannot be empty", () => {
    expect(topicValidator.validateSlug()).toEqual(
        {valid: false, msg: 'Slug must be a string!'});
  });

  test("Slug must be a string", () => {
    expect(topicValidator.validateSlug(2222222)).toEqual(
        {valid: false, msg: 'Slug must be a string!'});
  });  

  test("Slug cannot be an empty string", () => {
    expect(topicValidator.validateSlug("")).toEqual(
        {valid: false, msg: 'Slug cannot be empty!'});
  });    

  test("Slug cannot be an empty string", () => {
    expect(topicValidator.validateSlug("  ")).toEqual(
        {valid: false, msg: 'Slug cannot be empty!'});
  });      

  test("Slug cannot be contain spaces", () => {
    expect(topicValidator.validateSlug("a slug")).toEqual(
        {valid: false, msg: 'Slug contains invalid characters!'});
  });

  test("Slug can only contain letters", () => {
    expect(topicValidator.validateSlug("22")).toEqual(
        {valid: false, msg: 'Slug contains invalid characters!'});
  });  

  test("Slug can only contain letters", () => {
    expect(topicValidator.validateSlug("sdas@@!")).toEqual(
        {valid: false, msg: 'Slug contains invalid characters!'});
  });    

  test("Slug has a maximum length of 30 characters", () => {
    let slugLong = "";
    for(let i = 0; i < 35; i++)
      slugLong += "L";

    expect(topicValidator.validateSlug(slugLong)).toEqual(
        {valid: false, msg: 'Slug cannot be longer than 30 characters!'});
  });      

  test("Valid slug should return true", () => {
    expect(topicValidator.validateSlug("Valid")).toEqual(
        {valid: true});
  });    

  test("Valid slug should return true", () => {
    expect(topicValidator.validateSlug("C")).toEqual(
        {valid: true});
  });     
});

describe("validateDescription()", () => {
  test("Description cannot be undefined or null", () => {
    expect(topicValidator.validateDescription()).toEqual(
        {valid: false, msg: 'Description must be a string!'});
  });

  test("Description must be a string", () => {
    expect(topicValidator.validateDescription(222)).toEqual(
        {valid: false, msg: 'Description must be a string!'});
  });

  test("Description cannot be an empty string", () => {
    expect(topicValidator.validateDescription("")).toEqual(
        {valid: false, msg: 'Description cannot be empty!'});
  });  

  test("Description cannot be only spaces", () => {
    expect(topicValidator.validateDescription("  ")).toEqual(
        {valid: false, msg: 'Description cannot be empty!'});
  });  

  test("Description cannot start with spaces", () => {
    expect(topicValidator.validateDescription("  Description")).toEqual(
        {valid: false, msg: 'Description cannot start or end with spaces!'});
  });    

  test("Description cannot end with spaces", () => {
    expect(topicValidator.validateDescription("Description  ")).toEqual(
        {valid: false, msg: 'Description cannot start or end with spaces!'});
  });      

  test("Description can only contain letters, numbers and spaces", () => {
    expect(topicValidator.validateDescription("Invalid desc!ription")).toEqual(
        {valid: false, msg: 'Description contains invalid characters!'});
  });      

  test("Description cannot be longer than 130 characters", () => {
    let descLong = "";
    for(let i = 0; i < 150; i++)
      descLong += "T";

    expect(topicValidator.validateDescription(descLong)).toEqual(
        {valid: false, 
            msg: 'Description should be a maximum length of 130 characters!'});
  });    

  test("Valid description should return true", () => {
    expect(topicValidator.validateDescription("Valid Description")).toEqual(
        {valid: true});
  });    
});