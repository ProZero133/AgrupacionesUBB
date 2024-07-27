const { pool } = require('../db.js');
const nodemailer = require('nodemailer');
const config = require('../config/configEnv.js');
const { registrarUsuario } = require('../services/user.service.js');

const mailUser = config.MAIL_USER;
const mailPass = config.MAIL_PASS;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true para 465, false para otros puertos
  auth: {
    user: mailUser,
    pass: mailPass
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
    // busca el usuario en la base de datos servidor universidad (Simulado por el momento)
    const result = await pool.query(`SELECT * FROM sm_usuario WHERE correo = $1;`, [email]);
    if (result.rows.length === 0) {
      return { success: false, message: 'Usuario no encontrado' };
    }
    const usuario = result.rows[0];
    // busca el usuario en la base de datos de la plataforma
    const resultPlataforma = await validarUsuarioEnPlataforma(usuario.rut);
    usuario.rol= resultPlataforma.user[0].rol;
    // retorna toda la información del usuario
    if (resultPlataforma.success) {
      //añade el codigo de verificacion al usuario

      return { success: true, message: 'Usuario encontrado', usuario };
    } else {
      return { success: false, message: 'Usuario no encontrado' };
    }

   
  } catch (error) {
    return { success: false, message: 'Token inválido o expirado', error: error.message };
  }
}

async function validarUsuarioEnPlataforma(rut) {
  try {
    const result = await pool.query(`SELECT * FROM usuario WHERE rut = $1;`, [rut]);
    if (result.rows.length === 0) {
      return { success: false, message: 'Usuario no encontrado' };
    } else {
      return { success: true, message: 'Usuario encontrado', user: result.rows };
    }
  } catch (error) {
    return { success: false, message: 'Token inválido o expirado', error: error.message };
  }

}

async function asignarToken(fastify, usuario,codigo, reply) {

  const token = codigo;

  const mailOptions = {
    from: '"ConectaUBB" <conectaubb@gmail.com>', // dirección del remitente
    to: usuario.usuario.correo, // dirección del destinatario, pasada en la solicitud
    subject: 'Codigo de verificación de inicio de sesión',
    text: 'Aquí esta tu codigo de acceso unico.',
    html: `<b>Aquí esta tu codigo de acceso unico:</b> ${token}`
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    reply.send({ success: true, message: `Correo enviado a ${usuario.email}`, info: info });
  } catch (error) {
    reply.send({ success: false, message: `Error al enviar correo a ${usuario.email}`, error: error });
  }
};



module.exports = { validarUsuario, asignarToken };
