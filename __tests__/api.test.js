const request = require('supertest');

const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/');

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api", () => {
  test("Returns a valid endpoints object", () => {
    return request(app).get('/api').expect(200)
        .then(({body: endpointsObj}) => {
          // Weakly matches the general pattern of a URL method followed by a path
          const pathPattern = /^(GET|POST|PATCH|DELETE) \/[.]*/;
          
          for(const [path, pathObj] of Object.entries(endpointsObj)) {
            expect(pathPattern.test(path)).toBe(true);

            // Contains mandatory key of 'description'
            expect(pathObj).toMatchObject({
              description: expect.any(String)
            });

            // If optional 'queries' key exists, check it is an array
            if (pathObj.queries)
              expect(Array.isArray(pathObj.queries)).toBe(true);
          }
        });
  });
});