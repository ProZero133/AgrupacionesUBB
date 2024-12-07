const { validarUsuario, asignarToken, validarTokenService } = require('../services/auth.service');

async function validarTokenController(fastify, reply) {
  const { token } = fastify.query;
  try {
    const decoded = fastify.jwt.verify(token);
    const rol = decoded.rol; // Asegúrate de usar 'rol_u' para coincidir con tu estructura de datos
    // Establece una cookie de primera parte
    reply.setCookie('authToken', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 3600
    });

    // Redirige al usuario basado en su rol
    if (rol === 'Estudiante') {
      reply.redirect(`${url}/api/home`);
    } else if (rol === 'Admin') {
      reply.redirect(`${url}/api/adminhome`);
    } else {
      reply.send({ success: false, message: 'Rol no reconocido' });
    }
  } catch (error) {
    reply.send({ success: false, message: 'Token inválido o expirado', error: error.message });
  }
};

async function EmailLogin(request, reply) {
  const { email } = request.body; // Asume que el correo se envía en el cuerpo de la solicitud
  // Generar un código de verificación de 6 dígitos y letras
  const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
  // Llamar a la base de datos para verificar si el usuario existe
  const result = await validarUsuario(email);
  const usuario = result;
  if (result.success) {
    asignarToken(request.server, usuario, codigo, reply);
    //Envia el mismo codigo al frontend
    reply.send({ success: true, message: 'Código de verificación enviado', codigo: codigo, result: result });
  } else {
    console.log('Usuario no encontrado, no se enviará correo de verificación');
    reply.send({ success: false, message: 'Usuario no encontrado' });
  }
}

module.exports = { EmailLogin, validarTokenController};