const _ = require('lodash');
const logger = require('winston');
const authTokenCache = require('memory-cache');
const uuid = require('uuid/v1');
const moment = require('moment');

const generateAuthToken = usernameOrEmail => new Promise((resolve) => {
  const key = `${usernameOrEmail}-${uuid()}`;
  const authToken = new Buffer(key).toString('base64');
  const expiry = moment().utc().add(24, 'h');
  authTokenCache.put(authToken, expiry);
  const authHolder = {
    auth_token: authToken,
    expiry,
  };
  resolve(authHolder);
});

const clearAuthToken = token => new Promise((resolve) => {
  authTokenCache.del(token);
  resolve();
});

const isAuthTokenValid = authToken => new Promise((resolve) => {
  const expiry = moment(authTokenCache.get(authToken));
  if (!_.isNull(expiry)) {
    const now = moment.utc();
    const valid = now.isSameOrBefore(expiry);
    logger.debug(`AuthToken: ${authToken}`);
    logger.debug(`Now: ${now} date: ${moment(now).format('HH:mm:ss MM/DD/YYYY')}`);
    logger.debug(`Expiry time: ${expiry} date: ${moment(expiry).format('HH:mm:ss MM/DD/YYYY')}`);
    logger.debug(`Valid: ${valid}`);
    resolve(valid);
  } else {
    resolve(false);
  }
});


module.exports = {
  generateAuthToken,
  clearAuthToken,
  isAuthTokenValid,
};
