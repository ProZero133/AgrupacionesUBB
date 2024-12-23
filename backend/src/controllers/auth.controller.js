const { validarUsuario, asignarToken } = require('../services/auth.service');
async function TokenAutorizacionController(request, reply) {
 const { rol } = request.body; // Asume que el rol se envía en el cuerpo de la solicitud
  try {
    const payload = {
      rol,
    };
    const token = request.server.jwt.sign(payload);
    reply.setCookie('TokenAutorizacion', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 3600, // Expiración en segundos (1 hora)
    });


    reply.send({ success: true, message: 'Token válido', token: token });
  } catch (error) {
    reply.send({ success: false, message: 'Token inválido o expirado', error: error.message });
  }
}

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

module.exports = { EmailLogin, TokenAutorizacionController};