const request = require('supertest');

const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/');

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/users", () => {
  test("Returns 200 OK with an array of all the users", () => {
    return request(app).get('/api/users').expect(200)
        .then(({body}) => {
          const {users} = body;

          expect(users.length).toBe(4);

          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String)
            });

            // 'avatar_url' key is a valid URL
            expect(() => {new URL(user.avatar_url)}).not.toThrow(Error);
          });
        });
  });
});

describe("GET /api/users/:username", () => {
  test("Returns 200 OK with the correct user", () => {
    return request(app).get('/api/users/butter_bridge').expect(200)
        .then(({body}) => {
          const {user} = body;

          expect(user).toMatchObject({
            username: 'butter_bridge',
            name: 'jonny',
            avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/' 
                + '2016/06/Lime3.jpg'
          });
        });
  });

  test("Returns a 404 when the user does not exist", () => {
    return request(app).get('/api/users/unknown_user').expect(404)
        .then(({body}) => {
          expect(body.msg).toBe('Resource not found!');
        });
  });
});