require('dotenv').config();

const config = {
  webroot: process.env.PUBLIC_WEBROOT,
  views: process.env.VIEWS,
  pathtouploadsfolder: process.env.PATH_TO_UPLOADS,
};

const getConfig = () => config;

const getConfigValue = key => config[key];

module.exports = {
  getConfig,
  getConfigValue,
};
