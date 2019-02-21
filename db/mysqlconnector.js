//
// Main Application DB Connector
// https://github.com/lukeb-uk/node-promise-mysql
//
const mysql = require('promise-mysql');

// Pay attention to the options here:
// https://github.com/mysqljs/mysql#connection-options
const pool = mysql.createPool({
  connectionLimit: process.env.DSR_DB_CONNLIMIT,
  host: process.env.DSR_DB_HOST,
  ports: process.env.DSR_DB_PORT,
  user: process.env.DSR_DB_USER,
  password: process.env.DSR_DB_PASS,
  database: process.env.DSR_DB,
  debug: (process.env.DSR_DB_DEBUG === 'true'),
});

module.exports = pool;
