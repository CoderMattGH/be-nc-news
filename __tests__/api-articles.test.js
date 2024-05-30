require('jest-sorted');
const request = require('supertest');

const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/');

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/articles:article_id", () => {
  test("Returns the correct article", () => {
    return request(app).get('/api/articles/2').expect(200)
        .then(({body}) => {
          const article = body.article;

          expect(article).toMatchObject({
            article_id: 2,
            title: 'Sony Vaio; or, The Laptop',
            topic: 'mitch',
            author: 'icellusedkars',
            body: expect.any(String),
            created_at: '2020-10-16T05:03:00.000Z',
            votes: 0,
            article_img_url:
                'https://images.pexels.com/photos/158651/news-newsletter'
                + '-newspaper-information-158651.jpeg?w=700&h=700',
            comment_count: 0
          });

          expect(article.body.length).toBe(1123);
          expect(article.body).toContain(
              'Call me Mitchell. Some years ago—never mind how long precisely');
        });
  });

  test("Returns the correct comment count", () => {
    return request(app).get('/api/articles/1').expect(200)
        .then(({body}) => {
          expect(body.article.comment_count).toBe(11);
        });
  });

  test("Returns a 404 when article_id does not exist", () => {
    return request(app).get('/api/articles/99999').expect(404)
        .then(({body}) => {
          expect(body.msg).toBe('Resource not found!');
        });
  });

  test("Returns a 400 when article_id is not a number", () => {
    return request(app).get('/api/articles/banana').expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Bad request!');
        });
  });
});

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

describe("GET /api/articles", () => {
  test("Returns a valid articles array in descending order", () => {
    return request(app).get('/api/articles').expect(200)
        .then(({body}) => {
          const articles = body.articles;
          expect(articles).toHaveLength(5);

          // Sorted in descending order by created_at key
          expect(articles).toBeSorted({key: 'created_at', descending: true});

          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });

            // Does not contain 'body' key
            expect(article.body).toBeUndefined();

            // Expect article_img_url to be valid URL
            expect(() => new URL(article.article_img_url)).not.toThrow(Error);

            // Expect created_at to be valid Date
            expect(() => new Date(article.created_at)).not.toThrow(Error);
          });
        });
  });
});

describe("GET /api/articles?topic=<topic_name>", () => {
  test("Returns the articles filtered by topic", () => {
    return request(app).get('/api/articles?topic=mitch').expect(200)
        .then(({body}) => {
          const {articles} = body;

          expect(articles.length).toBe(4);

          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),              
            });

            // Does not contain 'body' key
            expect(article.body).toBeUndefined();
  
            // Expect article_img_url to be valid URL
            expect(() => new URL(article.article_img_url)).not.toThrow(Error);
  
            // Expect created_at to be valid Date
            expect(() => new Date(article.created_at)).not.toThrow(Error);          
          });
        });
  });

  test("Returns a 200 when an extant topic but no existing articles", () => {
    return request(app).get('/api/articles?topic=paper').expect(200)
        .then(({body}) => {
          const {articles} = body;

          expect(articles).toHaveLength(0);
        });
  });
 
  test("Returns a 404 when given a topic that does not exist", () => {
    return request(app).get('/api/articles?topic=banana').expect(404)
        .then(({body}) => {
          expect(body.msg).toBe('Resource not found!');
        });
  });
});

describe("GET /api/articles/?sort_by=<column>", () => {
  test("Articles sorted by author defaulting to descending order", () => {
    return request(app).get('/api/articles?sort_by=author').expect(200)
        .then(({body}) => {
          const {articles} = body;

          expect(articles).toHaveLength(5);
          expect(articles).toBeSorted({key: 'author', descending: true});
        });
  });

  test("Articles sorted by comment_count defaulting to descending order", () => {
    return request(app).get('/api/articles?sort_by=comment_count').expect(200)
        .then(({body}) => {
          const {articles} = body;

          expect(articles).toHaveLength(5);
          expect(articles).toBeSorted({key: 'comment_count', descending: true});
        });
  });

  test("Articles sorted by column defaulting to descending order", () => {
    const columnVals = ['author', 'title', 'article_id', 'topic', 'created_at', 
        'votes', 'comment_count'];
    
    const promiseArr = [];

    columnVals.forEach((columnName) => {
      const path = `/api/articles?sort_by=${columnName}`

      const promise = request(app).get(path).expect(200)
          .then(({body}) => {
            const {articles} = body;

            expect(articles).toHaveLength(5);
            expect(articles).toBeSorted({key: columnName, descending: true});
          });
      
      promiseArr.push(promise);
    });

    return Promise.all(promiseArr);
  });

  test("Articles sorted by invalid column should return 400 status", () => {
    return request(app).get('/api/articles/?sort_by=banana').expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Bad request!');
        });
  });
});

describe("GET /api/articles?order=<order>", () => {
  test("Articles sorted in ascending order", () => {
    return request(app).get('/api/articles?order=asc').expect(200)
        .then(({body}) => {
          const {articles} = body;

          expect(articles).toHaveLength(5);
          expect(articles).toBeSorted({key: 'created_at', descending: false});
        });
  });

  test("Articles sorted in descending order", () => {
    return request(app).get('/api/articles?order=desc').expect(200)
        .then(({body}) => {
          const {articles} = body;

          expect(articles).toHaveLength(5);
          expect(articles).toBeSorted({key: 'created_at', descending: true});
        });
  });  

  test("Articles sorted by invalid value should return 400 status", () => {
    return request(app).get('/api/articles?order=banana').expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Bad request!');
        });
  });
});

describe("GET /api/articles with multiple queries", () => {
  test("Articles should be sorted in ascending order by comment_count", () => {
    return request(app).get('/api/articles?order=asc&sort_by=comment_count')
        .expect(200)
        .then(({body}) => {
          const {articles} = body;

          expect(articles).toHaveLength(5);
          expect(articles).toBeSorted({key: 'comment_count', descending: false});
        });
  });

  test("Articles should be sorted in descending order by topic", () => {
    return request(app).get('/api/articles?order=desc&sort_by=topic')
        .expect(200)
        .then(({body}) => {
          const {articles} = body;

          expect(articles).toHaveLength(5);
          expect(articles).toBeSorted({key: 'topic', descending: true});
        });
  });

  test("Articles sorted in ascending order by author and filtered by topic", () => {
    return request(app).get('/api/articles?order=asc&sort_by=author&topic=mitch')
        .expect(200)
        .then(({body}) => {
          const {articles} = body;

          expect(articles).toHaveLength(4);
          expect(articles).toBeSorted({key: 'author', descending: false});
        });
  });

  test("Returns a 200 when given a invalid query in multi-query request", () => {
    return request(app).get('/api/articles?order=desc&sort_by=invalid')
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Bad request!');
        });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("Returns a 200 when given an extant article and valid request", () => {
    const reqObj = {inc_votes: 10};

    return request(app).patch('/api/articles/2').expect(200).send(reqObj)
        .then(({body}) => {
          const article = body.article;

          expect(article).toMatchObject({
            article_id: 2,
            title: 'Sony Vaio; or, The Laptop',
            topic: 'mitch',
            author: 'icellusedkars',
            body: expect.any(String),
            created_at: '2020-10-16T05:03:00.000Z',
            votes: 10,
            article_img_url: expect.any(String)
          });

          // Expect article_img_url to be valid URL
          expect(() => new URL(article.article_img_url)).not.toThrow(Error);
  
          // Expect created_at to be valid Date
          expect(() => new Date(article.created_at)).not.toThrow(Error);
        });
  });

  test("Vote count does not go below 0 when provided a negative vote", () => {
    const reqObj = {inc_votes: -3000};

    return request(app).patch('/api/articles/2').expect(200).send(reqObj)
        .then(({body}) => {
          const article = body.article;

          expect(article.votes).toBeGreaterThanOrEqual(0);
        });
  });

  test("Increments and does not replace current vote", () => {
    const reqObj1 = {inc_votes: 12};
    const reqObj2 = {inc_votes: 2};

    const path = '/api/articles/3';

    let votesAfterReq1 = 0;
    let votesAfterReq2 = 0;

    return request(app).patch(path).expect(200).send(reqObj1)
        .then(({body}) => {
          votesAfterReq1 = body.article.votes;

          return request(app).patch(path).expect(200).send(reqObj2);
        })
        .then(({body}) => {
          votesAfterReq2 = body.article.votes;

          expect(votesAfterReq1).toBe(reqObj1.inc_votes);
          expect(votesAfterReq2).toBe(reqObj1.inc_votes + reqObj2.inc_votes);
        });
  });

  test("Returns a 404 when given an article that doesn't exist", () => {
    const reqObj = {inc_votes: 2};

    return request(app).patch('/api/articles/9999').expect(404).send(reqObj)
        .then(({body}) => {
          expect(body.msg).toBe("Resource not found!");
        });
  });

  test("Returns a 400 when given an article that is not a number", () => {
    const reqObj = {inc_votes: 2};

    return request(app).patch('/api/articles/banana').expect(400).send(reqObj)
        .then(({body}) => {
          expect(body.msg).toBe("Bad request!");
        });
  });

  test("Returns a 400 when given a bad request object", () => {
    const reqObj = {invalid_key: 98};

    return request(app).patch('/api/articles/2').expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad request!");
        });    
  });
});