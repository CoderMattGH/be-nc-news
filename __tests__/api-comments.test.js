require('jest-sorted');
const request = require('supertest');

const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/');

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("DELETE /api/comments/:comment_id", () => {
  test("Returns a 204 status code with no content", () => {
    return request(app).delete('/api/comments/1').expect(204)
        .then(({body}) => {
          expect(body).toEqual({});
        });
  });

  test("Returns a 404 when the comment_id does not exist", () => {
    return request(app).delete('/api/comments/9999').expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("Resource not found!");
        });
  });

  test("Returns a 400 when the comment_id is not a number", () => {
    return request(app).delete('/api/comments/banana').expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad request!");
        });
  });
});