const request = require('supertest');

const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/');

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("Returns an array of all the topics", () => {
    return request(app).get('/api/topics').expect(200)
        .then(({body}) => {
          const {topics} = body;

          topics.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String)
            });
          });
        });
  });
});

describe("POST /api/topics", () => {
  test("Inserts a new topic into the database", () => {
    const topicObj = {slug: "Topic", description: "A topic description"};

    return request(app).post('/api/topics').send(topicObj).expect(200)
        .then(({body}) => {
          const {topic} = body;

          expect(topic).toMatchObject({
            slug: 'Topic',
            description: 'A topic description'
          });
        });
  });

  test("Returns a 400 status when slug contains spaces", () => {
    const topicObj = {slug: "new top", description: "No overwrite"};

    return request(app).post('/api/topics').send(topicObj).expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Slug contains invalid characters!');
        });
  });  

  test("Returns a 400 status when slug contains numbers", () => {
    const topicObj = {slug: "top23443", description: "Description"};

    return request(app).post('/api/topics').send(topicObj).expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Slug contains invalid characters!');
        });
  });    

  test("Returns a 400 status when slug is longer than 30 characters", () => {
    let slugLong = "";
    for(let i = 0; i < 40; i++)
      slugLong += 't';

    const topicObj = {slug: slugLong, description: "Description"};

    return request(app).post('/api/topics').send(topicObj).expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Slug cannot be longer than 30 characters!');
        });
  });    

  test("Returns a 400 status when slug is not a string", () => {
    const topicObj = {slug: 2222, description: "Description"};

    return request(app).post('/api/topics').send(topicObj).expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Slug must be a string!');
        });
  });  

  test("Returns a 400 status when description is not a string", () => {
    const topicObj = {slug: "slug", description: 222};

    return request(app).post('/api/topics').send(topicObj).expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Description must be a string!');
        });
  });  

  test("Returns a 400 status when description is just spaces", () => {
    const topicObj = {slug: "slug", description: "  "};

    return request(app).post('/api/topics').send(topicObj).expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Description cannot be empty!');
        });
  });    

  test("Returns a 400 status when description starts with spaces", () => {
    const topicObj = {slug: "slug", description: " description"};

    return request(app).post('/api/topics').send(topicObj).expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Description cannot start or end with spaces!');
        });
  });    

  test("Returns a 400 status when description ends with spaces", () => {
    const topicObj = {slug: "slug", description: "description "};

    return request(app).post('/api/topics').send(topicObj).expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Description cannot start or end with spaces!');
        });
  });      

  test("Returns a 400 status when description contains invalid characters", () => {
    const topicObj = {slug: "slug", description: "descr!ption"};

    return request(app).post('/api/topics').send(topicObj).expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Description contains invalid characters!');
        });
  });    

  test("Returns a 400 status when description is longer than 130 characters", () => {
    let descriptionLong = "";
    for (let i = 0; i < 150; i++)
      descriptionLong += "P";

    const topicObj = {slug: "slug", description: descriptionLong};

    return request(app).post('/api/topics').send(topicObj).expect(400)
        .then(({body}) => {
          expect(body.msg).toBe(
              'Description should be a maximum length of 130 characters!');
        });
  });      

  test("Doesn't overwrite an existing topic", () => {
    const topicObj = {slug: "cats", description: "No overwrite"};

    return request(app).post('/api/topics').send(topicObj).expect(409)
        .then(({body}) => {
          expect(body.msg).toBe('Resource already exists!');
        });
  });

  test("Returns a 400 status with an invalid topic", () => {
    const topicObj = {invalid: "new top", description: "No overwrite"};

    return request(app).post('/api/topics').send(topicObj).expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Slug must be a string!');
        });
  });  

  test("Returns a 400 status with an empty topic", () => {
    return request(app).post('/api/topics').expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Slug must be a string!');
        });
  });    
});