const userValidator = require('../../validators/user.validator.js');

describe("validateUsername()", () => {
  test("Username cannot be empty", () => {
    expect(userValidator.validateUsername()).toEqual(
        {valid: false, msg: 'Username must be a string!'});
  });

  test("Username must be a string", () => {
    expect(userValidator.validateUsername(2223231321)).toEqual(
        {valid: false, msg: 'Username must be a string!'});
  });
  test("Username cannot be an empty string", () => {
    expect(userValidator.validateUsername("")).toEqual(
        {valid: false, msg: 'Username cannot be empty!'});
  });

  test("Username cannot be an empty string", () => {
    expect(userValidator.validateUsername("  ")).toEqual(
        {valid: false, msg: 'Username cannot be empty!'});
  });  

  test("Username cannot contain spaces", () => {
    expect(userValidator.validateUsername("an invalid username")).toEqual(
        {valid: false, msg: 'Username contains invalid characters!'});
  });  

  test("Username should only cotain letters, numbers and underscores", () => {
    expect(userValidator.validateUsername("An!InvalidUsername")).toEqual(
        {valid: false, msg: 'Username contains invalid characters!'});
  });  
  
  test("Username length should not exceed 25 characters", () => {
    let usernameLong = "";
    for (let i = 0; i < 28; i++)
      usernameLong += "T";

    expect(userValidator.validateUsername(usernameLong)).toEqual(
        {valid: false, msg: 'Username cannot be longer than 25 characters!'});
  });  
  
  test("Username should not be shorter than 5 characters", () => {
    expect(userValidator.validateUsername("inv")).toEqual(
        {valid: false, msg: 'Username cannot be shorter than 5 characters!'});
  });    

  test("Valid username returns true", () => {
    expect(userValidator.validateUsername("Valid_Name")).toEqual(
        {valid: true});
  });
});

describe("validateName()", () => {
  test("Name cannot be empty", () => {
    expect(userValidator.validateName("")).toEqual(
        {valid: false, msg: 'Name cannot be empty!'});
  });

  test("Name cannot be undefined", () => {
    expect(userValidator.validateName()).toEqual(
      {valid: false, msg: 'Name must be a string!'});
  });

  test("Name cannot be empty", () => {
    expect(userValidator.validateName("")).toEqual(
      {valid: false, msg: 'Name cannot be empty!'});
  });

  test("Name should not start with spaces", () => {
    expect(userValidator.validateName("  Oh My Name")).toEqual(
      {valid: false, msg: 'Name cannot start or end with a space!'});
  });  

  test("Name should not end with spaces", () => {
    expect(userValidator.validateName("Oh My Name ")).toEqual(
      {valid: false, msg: 'Name cannot start or end with a space!'});
  });    

  test("Name should contain only letters and spaces", () => {
    expect(userValidator.validateName("Not a valid name!")).toEqual(
      {valid: false, msg: 'Name contains invalid characters!'});
  });    

  test("Name cannot be shorter than 5 characters", () => {
    expect(userValidator.validateName("Not")).toEqual(
      {valid: false, msg: 'Name cannot be shorter than 5 characters!'});
  });      

  test("Name cannot be longer than 130 characters", () => {
    let nameLong = "";
    for(let i = 0; i < 150; i++)
      nameLong += "T";

    expect(userValidator.validateName(nameLong)).toEqual
      ({valid: false, msg: 'Name cannot be longer than 130 characters!'});
  });    
  
  test("Valid name returns true", () => {
    expect(userValidator.validateName("This is a valid name")).toEqual
      ({valid: true});
  });      
});

describe("validateAvatarURL()", () => {
  test("Avatar URL cannot be empty", () => {
    expect(userValidator.validateAvatarURL("")).toEqual(
      {valid: false, msg: 'Avatar URL cannot be empty!'});
  });

  test("Avatar URL has to be a string", () => {
    expect(userValidator.validateAvatarURL(22222)).toEqual(
      {valid: false, msg: 'Avatar URL must be a string!'});
  });  

  test("Avatar URL must be a valid URL", () => {
    expect(userValidator.validateAvatarURL("notavalidurl.com")).toEqual(
      {valid: false, msg: 'Avatar URL is an invalid URL!'});
  });    

  test("Returns true with valid URL", () => {
    expect(userValidator.validateAvatarURL("http://image.com/img.jpg")).toEqual(
      {valid: true});
  });      
});
