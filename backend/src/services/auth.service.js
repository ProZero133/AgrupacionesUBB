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
    console.log('Resultado de la consulta:', result.rows);
    // Si no se encuentra el usuario
    if (result.rows.length === 0) {
      return { success: false, message: 'Usuario no encontrado' };
    }
    // Si se encuentra el usuario, se valida que exista en la base de datos de la plaforma
    else {
      const validarUsuario = await validarUsuarioEnPlataforma(result.rows[0].rut);
      // Si el usuario existe en el servidor de la universidad pero no en la plataforma, se registra el usuario en la plataforma
      if (!validarUsuario.success) {
        const ingresarUsuario = await registrarUsuario(result.rows[0].rut, result.rows[0].rol_u);
        if (ingresarUsuario.success) {
          return { success: true, message: 'Usuario registrado en la plataforma', user: result.rows };
        } else {
          return { success: false, message: 'Error al registrar usuario en la plataforma' };
        }
      }
      // Si el usuario existe en la plataforma y en el servidor de la universida, simplemente se retorna el usuario
      else {
        return { success: true, message: 'Usuario encontrado', user: result.rows };
      }
    }
  } catch (error) {
    return { success: false, message: 'Token inválido o expirado', error: error.message };
  }
}

async function validarUsuarioEnPlataforma(rut) {
  try {
    const result = await pool.query(`SELECT * FROM usuario WHERE rut = $1;`, [rut]);
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

async function asignarToken(fastify, usuario, reply) {
  const token = fastify.jwt.sign({
    rol: usuario.rol_u,
    email: usuario.correo,
    nombre_completo: usuario.nombre,
    rut: usuario.rut,
    carrera: usuario.carrera
  }, { expiresIn: '1h' });

  console.log('Enviando token al correo: ', usuario.correo);
  const decoded = fastify.jwt.verify(token);
  console.log('Decodificado:', decoded);

  const mailOptions = {
    from: '"ConectaUBB" <conectaubb@gmail.com>', // dirección del remitente
    to: usuario.correo, // dirección del destinatario, pasada en la solicitud
    subject: 'Enlace de verificación de inicio de sesión',
    text: 'Haz clic en el enlace para iniciar sesión.',
    html: `<b>Haz clic en el enlace para iniciar sesión:</b> <a href="http://localhost:3000/validarToken?token=${token}">Iniciar Sesión</a>`
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    reply.send({ success: true, message: `Correo enviado a ${usuario.email}`, info: info });
  } catch (error) {
    reply.send({ success: false, message: `Error al enviar correo a ${usuario.email}`, error: error });
  }
};



module.exports = { validarUsuario, asignarToken };
