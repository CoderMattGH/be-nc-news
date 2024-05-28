const request = require('supertest');

const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/');

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("Returns a status of 200 OK", () => {
    return request(app).get('/api/topics').expect(200);
  });

  test("Returns an array of all the topics", () => {
    return request(app).get('/api/topics').expect(200)
      .then((result) => {
        const topics = result.body.topics;

        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String)
          });
        });
      });
  });
});