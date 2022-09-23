require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool ({
  user: 'asaelgonzalez',
  host: 'localhost',
  database: 'qnaDB',
  password: 'null',
  port: process.env.PGPORT,
});

module.exports = pool;
