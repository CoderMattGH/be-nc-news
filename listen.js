const logger = require(`./logger/logger.js`);
const app = require('./app.js');

const { PORT = 9090 } = process.env;

app.listen(PORT, () => {
  logger.info(`Successfully listening on port ${PORT}`);
});