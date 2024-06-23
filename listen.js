require('./env-parser/env-parser.js');
const logger = require(`./logger/logger.js`);
const app = require('./app.js');

const {PORT = 9090} = process.env;
const {IP_ADD = '127.0.0.1'} = process.env;

app.listen(PORT, IP_ADD, () => {
  logger.info(`Successfully listening on port ${PORT} on ${IP_ADD}`);
});