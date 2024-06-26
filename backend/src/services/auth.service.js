const {pool} = require('../db.js');
const fastify = require('../main.js');
const nodemailer = require('nodemailer');
const fastifyCookie = require('@fastify/cookie');
const config = require('../config/configEnv.js');
const { jwt } = require('../main');
const mailUser = config.MAIL_USER;
const mailPass = config.MAIL_PASS;
const secret = config.JWT_SECRET;
const cookieSecret = config.COOKIE_SECRET;
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
async function validarUsuario(email) {
    try {
      const result = await pool.query(`SELECT * FROM sm_usuario WHERE correo = $1;`, [email]);
      console.log('Resultado de la consulta:', result.rows);
      if (result.rows.length === 0) {
        return { success: false, message: 'Usuario no encontrado' };
      } else {
        return { success: true, message: 'Usuario encontrado', user: result.rows };
      }
    } catch (error) {
      return { success: false, message: 'Token inválido o expirado', error: error.message };
    }
  }
  async function asignarToken(usuario) {
   const token = fastify.jwt.sign({ 
    rol: usuario.rol_u,
    email: usuario.email,
    nombre_completo: usuario.nombre_completo,
    rut: usuario.rut,
    carrera: usuario.carrera
   }, { expiresIn: '1h' });
    console.log('Enviando token al correo: ', usuario.email);
    const decoded = fastify.jwt.verify(token);
    console.log('Decodificado:', decoded);
    // Define el correo electrónico
    const mailOptions = {
        from: '"ConectaUBB" <conectaubb@gmail.com>', // dirección del remitente
        to: usuario.email, // dirección del destinatario, pasada en la solicitud
        subject: 'Enlace de verificación de inicio de sesión',
        text: 'Haz clic en el enlace para iniciar sesión.',
        html: `<b>Haz clic en el enlace para iniciar sesión:</b> <a href="http://localhost:3000/validarToken?token=${token}">Iniciar Sesión</a>`
      };
      try {
        let info = await transporter.sendMail(mailOptions);
        reply.send({ success: true, message: `Correo enviado a ${email}`, info: info });
      } catch (error) {
        reply.send({ success: false, message: `Error al enviar correo a ${email}`, error: error });
      }
  }
  module.exports = { validarUsuario, asignarToken };