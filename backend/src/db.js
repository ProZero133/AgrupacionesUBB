const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  user: process.env.user,
  password: process.env.password,
  host: process.env.host,
  port: process.env.portpg,
  database: process.env.database,
});
console.log("variables de entorno: "+process.env.user+" "+process.env.password+" "+process.env.host+" "+process.env.portpg+" "+process.env.database)
pool.query('SELECT 1')
    .then(() => console.log('Conexión a la base de datos exitosa'))
    .catch(err => console.error('Error al conectar a la base de datos:', err));
module.exports = { pool };