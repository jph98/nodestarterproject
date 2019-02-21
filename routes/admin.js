/* Admin */
const express = require('express');
const adminService = require('../services/sampleservice.js');
const logger = require('winston');
const _ = require('lodash');
_.mixin(require('underscore.string').exports());

const router = express.Router();

router.get('/', async (req, res) => {
  res.redirect('/');
});

module.exports = router;