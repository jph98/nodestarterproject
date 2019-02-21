const db = require('./db/mysqlconnector');
const fs = require('fs');
const chalk = require('chalk');
const os = require('os');
const logger = require('winston');
const _ = require('lodash');
_.mixin(require('underscore.string').exports());

logger.info('Using dev mail server');
emailService = require('./services/email.js');

function welcome() {
  fs.readFile('welcome.txt', (err, msg) => {
    if (err) throw err;
    logger.info(chalk.cyan('\n', msg.toString()));
    logger.info('Started on: %s:%s\t', os.hostname(), process.env.PORT);
    logger.info('Sentry DSN: %s \t', process.env.SENTRY_DSN);
    logger.info('Email server: \t%s:%s', process.env.EMAIL_HOST, process.env.EMAIL_PORT);
  });
}

function dbcheck() {
  return new Promise((resolve, reject) => {
    db.query('SELECT 1 FROM DUAL').then((result) => {
      logger.info(chalk.green('\t- Database Server: OK'));
      resolve(result);
    }).catch((err) => {
      logger.error('HEALTHCHECK: Connection to database could not be established: %s', err);
      reject(err);
    });
  });
}

async function onStart() {
  try {
    logger.info(chalk.bgBlue.blue.bold('Carrying out health check...'));
    //await dbcheck();
    //await emailService.checkConnectionToServer();
    logger.info(chalk.bgGreen.green.bold('Health Check: OK'));
    welcome();
  } catch (err) {
    logger.info(err);
    logger.info(chalk.bgRed.red.bold('Health Check: FAIL'));
  }
}

module.exports = {
  onStart,
};
