/* global require Promise fetch */
require('isomorphic-fetch');
require('../server/setup-env-vars');
const logger = require('../server/logger');

const typeToJobMap = {
  daily: ['daily-birthdays']
};

const type = process.argv[2];
if (type) {
  runCron(type);
} else {
  logger.info('Please provide a cron type');
}

function runCron(type) {
  const jobsToRun = typeToJobMap[type] || [];
  Promise.all(
    jobsToRun.map(async (job) => {
      const response = await fetch(
        `${process.env.BASE_URL}/cron/${job}?secret=${process.env.CRON_SECRET}`
      );
      if (response.ok && response.status === 200) {
        logger.info(`Cron job complete: ${job}`);
      } else {
        logger.info(`Cron job failed: ${job}`);
      }
    })
  ).then(() => {
    logger.info('All cron jobs complete');
  });
}
