const { Pool } = require("pg");
const config = require('./config/configEnv.js');
const user = config.USER;
const password = config.PASSWORD;
const host = config.HOST;
const portpg = config.PortPg;
const database = config.DATABASE;
const pool = new Pool({
  user: user,
  password: password,
  host: host,
  port: portpg,
  database: database,
});

pool.query('SELECT 1')
    .then(() => console.log('Conexión a la base de datos exitosa'))
    .catch(err => console.error('Error al conectar a la base de datos:', err));
module.exports = { pool };