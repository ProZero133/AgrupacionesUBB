const fastify = require('fastify')();
const fastifyCors = require('@fastify/cors');
const config = require('./config/configEnv.js');
const { Client } = require('pg');
const {pool} = require('./db.js');
// Usar las configuraciones importadas
const port = config.PORT;
const host = config.HOST;

// Habilita CORS en Fastify
fastify.register(fastifyCors, {
    origin: '*',
});
async function eliminarSolicitud(solicitudId) {
  try {
    // Realiza la lógica para eliminar la solicitud de la base de datos
    console.log(`consultando base de datos`);
    await pool.query('SELECT * FROM Usuario');
    console.log(`Consulta exitosa`);
  } catch (error) {
    console.error('Error al consultar base de datos:', error);
    throw error;
  }
}
// Define la ruta
fastify.get('/usuarios', async (request, reply) => {
  try {
      console.log('Consultando nombres de tablas en la base de datos...');
      
      // Realiza una consulta a information_schema.tables para obtener los nombres de todas las tablas
      const result = await pool.query(`
          SELECT * FROM usuario;
      `);
      
      console.log('Consulta exitosa');
      console.log('Enviando nombres de tablas en la respuesta...: ', result.rows);
      // Envía los nombres de las tablas en la respuesta
      reply
    .header('Content-Type', 'application/json')
    .send(result.rows);
  } catch (error) {
      console.error('Error en la consulta:', error);
      reply.status(500).send('Error interno del servidor');
  }
});

// Inicia el servidor con la configuración importada
fastify.listen({
    port: 3000,
    host: '192.168.100.2',
}, (err) => {
    if (err) {
        console.error('Error al iniciar el servidor:', err);
        process.exit(1);
    }
    console.log(`Servidor escuchando en el puerto ${port}`);
});