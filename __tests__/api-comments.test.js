require('jest-sorted');
const request = require('supertest');

const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/');

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/articles/:article_id/comments", () => {
  test("Returns a comments array for the specified article", () => {
    return request(app).get('/api/articles/1/comments').expect(200)
        .then(({body}) => {
          const comments = body.comments;

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
        .then(({body}) => {
          expect(body.msg).toBe("Resource not found!");
        });
  });

  test("Returns a 400 when the article_id is not a number", () => {
    return request(app).get('/api/articles/banana/comments').expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad request!");
        });
  });

  test("Returns a 200 OK when the article_id exists, but no comments exist",
      () => {
        return request(app).get('/api/articles/4/comments').expect(200)
            .then(({body}) => {
              expect(body.comments).toHaveLength(0);
            });
      });
});

describe("POST /api/articles/:article_id/comments", () => {
  test(
      "Returns 200 OK when provided with an existing user and article and valid body", 
      () => {
        const commentObj = {
          username: "butter_bridge",
          body: "That would be an ecumenical matter."
        };

        return request(app).post('/api/articles/2/comments').send(commentObj)
            .expect(200)
            .then(({body}) => {
              const {comment} = body;
              console.log(comment);

              expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                body: 'That would be an ecumenical matter.',
                article_id: 2,
                author: 'butter_bridge',
                votes: 0,
                created_at: expect.any(String)
              });

              // Check 'created_at' key is valid Date
              expect(() => new Date(comment.created_at)).not.toThrow(Error);
            });
        }
  );
  
  test("Returns a 404 when provided with an non-existent article id", () => {
    const commentObj = {
      username: "butter_bridge",
      body: "That would be an ecumenical matter."
    };
    
    return request(app).post('/api/articles/9999/comments').send(commentObj)
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe('Resource not found!');
        });
  });

  test("Returns a 404 when provided with a non-existent username", () => {
    const commentObj = {
      username: "unknown_user",
      body: "That would be an ecumenical matter."
    };

    return request(app).post('/api/articles/2/comments').send(commentObj)
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe('Resource not found!');
        });
  });

  test("Returns a 400 when article_id is not a number", () => {
    const commentObj = {
      username: "butter_bridge",
      body: "That would be an ecumenical matter."
    };
    
    return request(app).post('/api/articles/banana/comments').send(commentObj)
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Bad request!');
        });
  });

  test("Returns a 400 when comment object has invalid keys", () => {
    const commentObj = {
      invalidKey: 'random'
    };

    return request(app).post('/api/articles/banana/comments').send(commentObj)
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Bad request!');
        });
  });

  test("Returns a 400 when comment object has invalid keys", () => {
    const commentObj = {
      username: 22,
      body: 22
    };

    return request(app).post('/api/articles/banana/comments').send(commentObj)
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Bad request!');
        });
  });  
});

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