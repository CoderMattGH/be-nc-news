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
    const topicObj = {slug: "A topic", description: "A topic description"};

    return request(app).post('/api/topics').send(topicObj).expect(200)
        .then(({body}) => {
          const {topic} = body;

          expect(topic).toMatchObject({
            slug: 'A topic',
            description: 'A topic description'
          });
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
          expect(body.msg).toBe('Bad request!');
        });
  });  

  test("Returns a 400 status with an empty topic", () => {
    return request(app).post('/api/topics').expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Bad request!');
        });
  });    
});