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

describe("PATCH /api/comments/:comment_id", () => {
  test("Increases votes on comment by 20 and returns modifed comment", () => {
    const reqObj = {inc_votes: 20};

    return request(app).patch('/api/comments/1').send(reqObj).expect(200)
        .then(({body}) => {
          const {comment} = body;

          expect(comment).toMatchObject({
            comment_id: 1,
            body: expect.any(String),
            article_id: 9,
            author: 'butter_bridge',
            votes: 36,
            created_at: '2020-04-06T12:17:00.000Z'
          });
        });
  });

  test("Decreases votes on comment by 10 and returns modifed comment", () => {
    const reqObj = {inc_votes: -10};

    return request(app).patch('/api/comments/1').send(reqObj).expect(200)
        .then(({body}) => {
          const {comment} = body;

          expect(comment).toMatchObject({
            comment_id: 1,
            body: expect.any(String),
            article_id: 9,
            author: 'butter_bridge',
            votes: 6,
            created_at: '2020-04-06T12:17:00.000Z'
          });
        });
  }); 
  
  test("Increments and doesn't overwrite comment vote count", () => {
    const reqObj = {inc_votes: 3};

    const path = '/api/comments/2';

    let result1 = 0;
    let result2 = 0;

    return request(app).patch(path).send(reqObj).expect(200)
        .then(({body}) => {
          result1 = body.comment.votes;

          return request(app).patch(path).send(reqObj).expect(200);
        })
        .then(({body}) => {
          result2 = body.comment.votes;

          expect(result1).toBe(17);
          expect(result2).toBe(result1 + reqObj.inc_votes);
        });
  });

  test("Returns a 404 error when the comment_id doesn't exist", () => {
    const reqObj = {inc_votes: -20};

    return request(app).patch('/api/comments/9999').send(reqObj).expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("Resource not found!");
        });
  });

  test("Returns a 400 status when given a comment_id that isn't a number", () => {
    const reqObj = {inc_votes: -20};

    return request(app).patch('/api/comments/banana').send(reqObj).expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad request!");
        });
  });

  test("Returns a 400 status when given an invalid request object", () => {
    const reqObj = {inc_votes: 'banana'};

    return request(app).patch('/api/comments/banana').send(reqObj).expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad request!");
        });
  });  

  test("Returns a 400 status when given an invalid request object", () => {
    const reqObj = {wrong_key: 'banana'};

    return request(app).patch('/api/comments/banana').send(reqObj).expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad request!");
        });
  });    
});