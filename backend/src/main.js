const fastify = require('fastify')();
const fastifyCors = require('@fastify/cors');
const config = require('./config/configEnv.js');
const { Client } = require('pg');
const {pool} = require('./db.js');
// Usar las configuraciones importadas
const port = config.PORT;
const host = config.HOST;

// Enrutador de la aplicación
const publicacionRoutes = require('./routes/publicacion.routes.js');
const usuarioRoutes = require('./routes/usuario.routes.js');
const agrupacionRoutes = require('./routes/agrupacion.routes.js');
const actividadRoutes = require('./routes/actividad.routes.js');

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
fastify.get('/usuarios', async (request, reply) => {
  try {
      console.log('Consultando nombres de tablas en la base de datos...');
      const result = await pool.query(`
          SELECT * FROM usuario;
      `);
      
      console.log('Consulta exitosa');
      console.log('Enviando nombres de tablas en la respuesta...: ', result.rows);
      reply
    .header('Content-Type', 'application/json')
    .send(result.rows);
  } catch (error) {
      console.error('Error en la consulta:', error);
      reply.status(500).send('Error interno del servidor');
  }
});
fastify.get('/agrupaciones', async (request, reply) => {
  try {
      console.log('Consultando nombres de tablas en la base de datos...');
      const result = await pool.query(`
          SELECT * FROM "Agrupacion";
      `);
      
      console.log('Consulta exitosa');
      console.log('Enviando nombres de tablas en la respuesta...: ', result.rows);
      reply
    .header('Content-Type', 'application/json')
    .send(result.rows);
  } catch (error) {
      console.error('Error en la consulta:', error);
      reply.status(500).send('Error interno del servidor');
  }
});
fastify.post('/agrupacion', async (request, reply) => {
  try {
    console.log('Insertando nueva agrupacion en la base de datos...');

    const { nombre_agr, descripcion, rut, fecha_creacion, verificado, fecha_verificacion } = request.body;

    const result = await pool.query(`
      INSERT INTO "Agrupacion" (nombre_agr, descripcion, rut, fecha_creacion, verificado, fecha_verificacion)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `, [nombre_agr, descripcion, rut, fecha_creacion, verificado, fecha_verificacion]);

    console.log('Inserción exitosa');
    console.log('Enviando nueva agrupacion en la respuesta...: ', result.rows[0]);
    reply
      .header('Content-Type', 'application/json')
      .send(result.rows[0]);
  } catch (error) {
    console.error('Error en la inserción:', error);
    reply.status(500).send('Error interno del servidor');
  }
});
fastify.post('/actividad', async (request, reply) => {
  try {
    console.log('Insertando nueva actividad en la base de datos...');
    const { nom_act, descripcion, imagen, tipo, id_agr } = request.body;

    const result = await pool.query(`
      INSERT INTO "Actividad" (nom_act, descripcion, imagen, tipo, id_agr)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, [nom_act, descripcion, imagen, tipo, id_agr]);

    console.log('Inserción exitosa');
    console.log('Enviando nueva actividad en la respuesta...: ', result.rows[0]);
    reply
      .header('Content-Type', 'application/json')
      .send(result.rows[0]);
  } catch (error) {
    console.error('Error en la inserción:', error);
    reply.status(500).send('Error interno del servidor');
  }
});
fastify.get('/actividades', async (request, reply) => {
  try {
      console.log('Consultando nombres de tablas en la base de datos...');
      const result = await pool.query(`
          SELECT * FROM "Actividad";
      `);
      
      console.log('Consulta exitosa');
      console.log('Enviando nombres de tablas en la respuesta...: ', result.rows);
      reply
    .header('Content-Type', 'application/json')
    .send(result.rows);
  } catch (error) {
      console.error('Error en la consulta:', error);
      reply.status(500).send('Error interno del servidor');
  }
});
fastify.
fastify.listen({
    port: 3000,
    host: '0.0.0.0',
}, (err) => {
    if (err) {
        console.error('Error al iniciar el servidor:', err);
        process.exit(1);
    }
    console.log(`Servidor escuchando en el puerto ${port}`);
});