const winston = require('winston');
const {combine, timestamp, printf, colorize, align} = winston.format;

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

module.exports = logger;