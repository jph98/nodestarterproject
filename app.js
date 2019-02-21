//
// DSR Services
//
require('dotenv').config();

const express = require('express');
const path = require('path');
const _ = require('underscore');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const Raven = require('raven');
const logger = require('winston');
const expressWinston = require('express-winston');
const methodOverride = require('method-override');

const app = express();

// ------------------------------------------------------------------------
// Sentry error logger
// ------------------------------------------------------------------------

logger.info(`Sentry Status: ${process.env.SENTRY_DSN}`);
if (!_.isEmpty(process.env.SENTRY_DSN)) {
  Raven.config(`${process.env.SENTRY_DSN}`).install();
  app.use(Raven.requestHandler());
  app.use(Raven.errorHandler());
  logger.info('Sentry installed');
}

// ------------------------------------------------------------------------
// Static Content
// ------------------------------------------------------------------------

app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------------------------------------------
// HTTP Verb Handling
// ------------------------------------------------------------------------

app.use(methodOverride('_method'));

// ------------------------------------------------------------------------
// Logger
// ------------------------------------------------------------------------

// See: https://github.com/bithavoc/express-winston
app.use(expressWinston.logger({
  transports: [
    new logger.transports.Console({
      json: false,
      colorize: true,
    }),
  ],
  meta: false,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: true,
  ignoreRoute: false,
}));

logger.level = 'debug';

app.use(expressWinston.errorLogger({
  transports: [
    new logger.transports.Console({
      json: false,
      colorize: true,
    }),
  ],
}));

// ------------------------------------------------------------------------
// BodyParser and Validation
// ------------------------------------------------------------------------

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());

// ------------------------------------------------------------------------
// Express Routes
// ------------------------------------------------------------------------

// Admin pages
app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
// app.use((req, res, next) => {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

app.use((req, res, next) => {
  if (!req.route) {
    logger.info(`Could not find route: ${req.originalUrl}`);
    return next(new Error('404'));
  }
  return next();
});

module.exports = app;
