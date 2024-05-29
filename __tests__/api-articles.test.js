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
          const articles = body.articles;

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

  test("Returns a 200 OK when an extant topic but no existing articles", () => {
    return request(app).get('/api/articles?topic=paper').expect(200)
        .then(({body}) => {
          const articles = body.articles;

          expect(articles.length).toBe(0);
        });
  });
 
  test("Returns a 404 when given a topic that does not exist", () => {
    return request(app).get('/api/articles?topic=banana').expect(404)
        .then(({body}) => {
          expect(body.msg).toBe('Resource not found!');
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