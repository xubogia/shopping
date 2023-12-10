import mysql from 'mysql2';

export const dbConnection = mysql.createPool({
  connectionLimit: 10,
  host: '47.96.36.206',
  user: 'abiu',
  password: '8818637',
  database: 'shopping',
});
