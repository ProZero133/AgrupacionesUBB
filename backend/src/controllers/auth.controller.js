const { validarUsuario, asignarToken } = require('../services/auth.service');
async function TokenAutorizacionController(request, reply) {
 const decoded = await request.jwtVerify();
 const rol = decoded.rol;
 const rut = decoded.rut;
 if(rol !== decoded.rol){
    reply.send({ success: false, message: 'Rol no autorizado' });
    return;
  }
  
  try {
    const payload = {
      rol,
      rut,
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
    const payload = {
      rol: result.usuario.rol,
      rut: result.usuario.rut,
    };
    const token = request.server.jwt.sign(payload);
    reply.setCookie('AuthToken', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 3600, // Expiración en segundos (1 hora)
    });
    asignarToken(request.server, usuario, codigo, reply);
    //Envia el mismo codigo al frontend
    reply.send({ success: true, message: 'Código de verificación enviado', codigo: codigo, result: result, token: token });
  } else {
    reply.send({ success: false, message: result.message });
  }
}

module.exports = { EmailLogin, TokenAutorizacionController};