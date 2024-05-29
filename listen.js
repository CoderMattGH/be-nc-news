const logger = require(`./logger/logger.js`);
const app = require('./app.js');

const PORT_NO = 9090;

app.listen(PORT_NO, () => {
  logger.info(`Successfully listening on port ${PORT_NO}`);
});