require('jest-sorted');
const request = require('supertest');

const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/');

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/articles/:article_id/comments", () => {
  test("Returns 200 OK when given an existant article_id", () => {
    return request(app).get('/api/articles/1/comments').expect(200);
  });

  test("Returns a comments array for the specified article", () => {
    return request(app).get('/api/articles/1/comments').expect(200)
      .then((result) => {
        const comments = result.body.comments;

        expect(comments.length).toBe(11);

        // Check comments are ordered by 'created_at' in descending order
        expect(comments).toBeSorted({key: 'created_at', descending: true});

        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number)
          });

          // Check 'created_at' key is a valid date
          expect(() => new Date(comment.created_at)).not.toThrow(Error);
        });
      });
  });

  test("Returns a 404 when the article_id does not exist", () => {
    return request(app).get('/api/articles/9999/comments').expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("Article not found!");
      });
  });

  test("Returns a 400 when the article_id is not a number", () => {
    return request(app).get('/api/articles/banana/comments').expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Bad request!");
      });
  });

  test("Returns a 200 OK when the article_id exists, but no comments exist",
    () => {
      return request(app).get('/api/articles/4/comments').expect(200)
        .then((result) => {
          expect(result.body.comments).toHaveLength(0);
        });
    });
});