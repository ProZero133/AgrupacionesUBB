const fastify = require('fastify')();
const fastifyCors = require('@fastify/cors');
const config = require('./config/configEnv.js');
const { Client } = require('pg');
const {pool} = require('./db.js');
const jwt = require('@fastify/jwt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

fastify.register(fastifyCors, {
  // Configura los orígenes permitidos
  origin: "http://localhost:5173"
});



// Usar las configuraciones importadas
const port = config.PORT;
const host = config.HOST;
const secret = '64hjf73u8dfjfjrj3846hrk@klsd';
const refreshSecret = config.REFRESH_JWT_SECRET;
const mailUser = config.MAIL_USER;
const mailPass = config.MAIL_PASS;

// Configura el transporte de Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Cambia esto por tu servidor SMTP
  port: 465,
  secure: true, // true para 465, false para otros puertos
  auth: {
    user: mailUser, // tu correo
    pass: mailPass // tu contraseña
  }
});

transporter.verify((error) => {
  if (error) {
    console.error('Error al verificar el transporte:', error);
  } else {
    console.log('Transporte listo para enviar correos');
  }
});

fastify.post('/EmailLogin', async (request, reply) => {
  const { email } = request.body; // Asume que el correo se envía en el cuerpo de la solicitud

  // Define el correo electrónico
  const mailOptions = {
    from: '"Prueba correo" <conectaubb@gmail.com>', // dirección del remitente
    to: email, // dirección del destinatario, pasada en la solicitud
    subject: 'Enlace Importante', // Asunto del correo
    text: 'Aquí está tu enlace.', // cuerpo del correo en texto plano
    html: '<b>Aquí está tu enlace.</b>' // cuerpo del correo en HTML
  };

  // Envía el correo electrónico
  try {
    let info = await transporter.sendMail(mailOptions);
    reply.send({ success: true, message: `Correo enviado a ${email}`, info: info });
  } catch (error) {
    reply.send({ success: false, message: `Error al enviar correo a ${email}`, error: error });
  }
});

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
console.log('Nombre: ', request.body.nombre_agr, 'Descripcion: ', request.body.descripcion, 'Rut: ', request.body.rut, 'Fecha creacion: ', request.body.fecha_creacion, 'Verificado: ', request.body.verificado, 'Fecha verificacion: ', request.body.fecha_verificacion)
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
    let { nom_act, descripcion, imagen, tipo, id_agr } = request.body;

    // Si no se proporciona ninguna imagen, establecer imagen en null
    if (imagen === undefined) {
      imagen = null;
    }

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