const db = require('../db/mysqlconnector');
const Promise = require('bluebird');
const logger = require('winston');

const getNumberOfUsers = () => new Promise((resolve, reject) => {
  db.query('SELECT count(*) as count FROM user').then((result) => {
    resolve(result[0].count);
  }).catch((err) => {
    logger.error(`Error querying number of users ${err}`);
    reject(err);
  });
});