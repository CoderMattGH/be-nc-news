const winston = require('winston');
const {combine, timestamp, printf, colorize, align} = winston.format;

// If LOGL env var not set, then default to 'error'
const LOGL = process.env.LOGL || 'error';

const logger = winston.createLogger({
  level: LOGL,
  format: combine(
      colorize({all: true}),
      timestamp({format: 'YYYY-MM-DD hh:mm:ss.SSS A'}), 
      align(),
      printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
  transports: [new winston.transports.Console()]
});

logger.info(`Initialised logger!`);

module.exports = logger;