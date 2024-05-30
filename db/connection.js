require('../env-parser/env-parser.js');
const {Pool} = require('pg');

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}

module.exports = new Pool();
