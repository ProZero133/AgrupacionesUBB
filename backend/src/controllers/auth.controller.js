const { validarUsuario, asignarToken, validarUsuarioRut } = require('../services/auth.service');
const bcrypt = require('bcrypt');
const saltRounds = 10;
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
  const hashedCode = await bcrypt.hash(codigo, saltRounds);
  // Llamar a la base de datos para verificar si el usuario existe
  const result = await validarUsuario(email);
  const usuario = result;
  if (result.success !=false) {
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
    reply.send({ success: true, message: 'Código de verificación enviado', codigo: hashedCode, result: result, token: token });
  } else {
    reply.code(401).send({ success: false, message: result.message });
  }
}

async function RutLogin(request, reply) {
  const { rut } = request.body; // Asume que el correo se envía en el cuerpo de la solicitud
  // Generar un código de verificación de 6 dígitos y letras
  const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
  const hashedCode = await bcrypt.hash(codigo, saltRounds);
  // Llamar a la base de datos para verificar si el usuario existe
  const result = await validarUsuarioRut(rut);
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
    reply.send({ success: true, message: 'Código de verificación enviado', codigo: hashedCode, result: result, token: token });
  } else {
    reply.code(401).send({ success: false, message: result.message });
  }
}

module.exports = { EmailLogin, TokenAutorizacionController, RutLogin };