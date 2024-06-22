require('./env-parser/env-parser.js');
const logger = require(`./logger/logger.js`);
const app = require('./app.js');

const {PORT = 9090} = process.env;

app.listen(PORT, '127.0.0.1', () => {
  logger.info(`Successfully listening on port ${PORT} on 127.0.0.1`);
});