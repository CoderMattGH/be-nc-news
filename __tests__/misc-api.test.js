const request = require('supertest');

const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/');

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("Misc. api tests", () => {
  test("Returns 404 when requesting a non-existent endpoint", () => {
    return request(app).get('/api/banana').expect(404);
  });
});