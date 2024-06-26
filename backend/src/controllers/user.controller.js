const { validarUsuario, asignarToken } = require('../services/auth.service');

async function EmailLogin(request, reply) {
  const { email } = request.body; // Asume que el correo se envía en el cuerpo de la solicitud
  // Llamar a la base de datos para verificar si el usuario existe
  const result = await validarUsuario(email);
  const usuario = result.user[0];
  if (result.success) {
    console.log('Usuario encontrado, enviando correo de verificación...');
    console.log(`Rol: ${usuario.rol_u}`);
    console.log(`Email: ${usuario.correo}`);
    asignarToken(request.server, usuario, reply);
  } else {
    console.log('Usuario no encontrado, no se enviará correo de verificación');
    reply.send({ success: false, message: 'Usuario no encontrado' });
  }
}

module.exports = { EmailLogin };
