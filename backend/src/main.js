const fastify = require('fastify')();
const fastifyCors = require('@fastify/cors');
const config = require('./config/configEnv.js');
const { Client } = require('pg');
const {pool} = require('./db.js');
const jwt = require('@fastify/jwt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
// Usar las configuraciones importadas
const port = config.PORT;
const host = config.HOST;
const secret = '64hjf73u8dfjfjrj3846hrk@klsd';
const refreshSecret = config.REFRESH_JWT_SECRET;

fastify.register(require('@fastify/jwt'), {
  secret: '64hjf73u8dfjfjrj3846hrk@klsd'
});

// Habilita CORS en Fastify
fastify.register(fastifyCors, {
    origin: '*',
});
fastify.register(require('fastify-oauth2'), {
  name: 'googleOAuth2',
  scope: 'https://www.googleapis.com/auth/plus.login',
  credentials: {
    client: {
      id: '<CLIENT_ID>',
      secret: '<CLIENT_SECRET>'
    },
    auth: require('fastify-oauth2').GOOGLE_CONFIGURATION
  },
  startRedirectPath: '/login/google',
  callbackUri: 'http://localhost:3000/login/google/callback'
})

fastify.get('/login/google/callback', async function (request, reply) {
  const token = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
  // token.access_token is the Google access token

  // Aquí puedes obtener información del usuario desde Google y usarla para crear una sesión,
  // generar un JWT, etc.

  reply.send({ access_token: token.access_token })
})
fastify.post('/login', async (request, reply) => {
  try {
    const { email } = request.body;

    // Generar un token aleatorio
    const token = crypto.randomBytes(20).toString('hex');

    // Crear un JWT con el correo electrónico y el token
    const jwtToken = fastify.jwt.sign({ email, token });

    // Configurar el transporte de correo
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'conectaubb@gmail.com',
        pass: 'GestionDeAnteproyacticaProfesional2'
      }
    });

    // Enviar un correo electrónico al usuario con el enlace de confirmación
    let info = await transporter.sendMail({
      from: 'conectaubb@gmail.com',
      to: email,
      subject: 'Confirm your email',
      text: `Please confirm your email by clicking on the following link: http://localhost:3000/confirm?token=${jwtToken}`
    });

    reply.send({ message: 'Please check your email to confirm your account.' });
  } catch (error) {
    console.error('Error:', error);
    reply.status(500).send('Internal server error');
  }
});

fastify.get('/confirm', async (request, reply) => {
  try {
    const { token } = request.query;

    // Verificar el JWT
    const decoded = jwt.verify(token, secret);

    // Aquí puedes autenticar al usuario en tu aplicación, por ejemplo, creando una sesión

    reply.send({ message: 'Your account has been confirmed.' });
  } catch (error) {
    console.error('Error:', error);
    reply.status(500).send('Internal server error');
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