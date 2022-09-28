import * as pg from 'pg';
const { Pool } = pg;

export default new Pool({
  user: 'postgres',
  password: '1234',
  host: 'localhost',
  port: 5432,
  database: 'carRental'
});