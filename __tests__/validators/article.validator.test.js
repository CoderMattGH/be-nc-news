const articleValidator = require('../../validators/article.validator.js');

describe("validateImgURL()", () => {
  test("Image URL cannot be empty", () => {
    expect(articleValidator.validateImgURL("")).toEqual(
        {valid: false, msg: 'Image URL cannot be empty!'});
  });

  test("Image URL cannot just be spaces", () => {
    expect(articleValidator.validateImgURL("   ")).toEqual(
        {valid: false, msg: 'Image URL cannot be empty!'});
  });

  test("Image URL cannot be a number", () => {
    expect(articleValidator.validateImgURL(2)).toEqual(
        {valid: false, msg: 'Image URL must be a string!'});
  });

  test("Image URL must be a valid URL", () => {
    expect(articleValidator.validateImgURL("http://z^%&*%£&^^")).toEqual(
        {valid: false, msg: 'Image URL must be a valid URL!'});
  });

  test("Returns true with a valid URL", () => {
    expect(articleValidator.validateImgURL("http://my-image.com/img.jpg"))
        .toEqual({valid: true});
  });
});

describe("validateTitle()", () => {
  test("Title cannot be an empty string", () => {
    expect(articleValidator.validateTitle("")).toEqual(
        {valid: false, msg: 'Title cannot be empty!'});
  });

  test("Title cannot be just spaces", () => {
    expect(articleValidator.validateTitle("   ")).toEqual(
        {valid: false, msg: 'Title cannot be empty!'});
  });  

  test("Title must be a string", () => {
    expect(articleValidator.validateTitle(2222)).toEqual(
        {valid: false, msg: 'Title must be a string!'});
  });  

  test("Title cannot start with a space", () => {
    expect(articleValidator.validateTitle(" My Invalid Title")).toEqual(
        {valid: false, msg: 'Title cannot start or end with spaces!'});
  });

  test("Title cannot end with a space", () => {
    expect(articleValidator.validateTitle("My Invalid Title ")).toEqual(
      {valid: false, msg: 'Title cannot start or end with spaces!'});
  });

  test("Title cannot contain invalid characters", () => {
    expect(articleValidator.validateTitle("My @@@i!d Title")).toEqual(
      {valid: false, msg: 'Title contains invalid characters!'});
  });  

  test("Title cannot be longer than 130 characters", () => {
    let longTitle = '';
    for (let i = 0; i < 150; i++)
      longTitle += 'T';

    expect(articleValidator.validateTitle(longTitle)).toEqual(
        {valid: false, msg: 'Title cannot be longer than 130 characters!'});
  });

  test("Valid title returns true", () => {
    expect(articleValidator.validateTitle("I am a valid title")).toEqual(
        {valid: true});
  });
});

describe("validateBody()", () => {
  test("Body cannot be an empty string", () => {
    expect(articleValidator.validateBody("")).toEqual(
      {valid: false, msg: 'Body cannot be empty!'});
  });

  test("Body cannot be just spaces", () => {
    expect(articleValidator.validateBody("   ")).toEqual(
        {valid: false, msg: 'Body cannot be empty!'});
  });   
  
  test("Body must be a string", () => {
    expect(articleValidator.validateBody(22)).toEqual(
        {valid: false, msg: 'Body must be a string!'});
  });    
  
  test("Body cannot start with a space", () => {
    expect(articleValidator.validateBody(" I am a body")).toEqual(
        {valid: false, msg: 'Body cannot start or end with spaces!'});
  });      

  test("Body cannot end with a space", () => {
    expect(articleValidator.validateBody("I am a body  ")).toEqual(
        {valid: false, msg: 'Body cannot start or end with spaces!'});
  });        

  test("Body length must not be longer than 20000 characters", () => {
    let longBody = "";
    for(let i = 0; i < 25000; i++)
      longBody += 'T';

    expect(articleValidator.validateBody(longBody)).toEqual(
        {valid: false, msg: 'Body cannot be longer than 20000 characters!'});
  });     

  test("Valid body returns true", () => {
    expect(articleValidator.validateBody("This is a valid body.")).toEqual(
        {valid: true});
  });
});