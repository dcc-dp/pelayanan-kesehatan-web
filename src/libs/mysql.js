import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pelayanan-kesehatan-web',
  waitForConnections: true,
});

export default pool;
