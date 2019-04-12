const winston = require('winston');

// Create a Winston logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
const transports = [
  new winston.transports.Console({
    colorize: true,
    format: winston.format.simple(),
    json: false,
    level: 'debug'
  })
];

const logger = winston.createLogger({
  level: 'info',
  transports
});

logger.stream = {
  write: (message) => {
    logger.info(message);
  }
};

module.exports = logger;
