const { validarUsuario, asignarToken } = require('../services/auth.service');
const { getAgrupaciones } = require('../services/agrupacion.service');
const { getUsuarioByRut } = require('../services/user.service');
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

async function VerGrupos(request, reply) {
  const agrupaciones = await getAgrupaciones();
  if (agrupaciones.length === 0) {
    return reply.send({ success: false, message: 'No se encontraron agrupaciones' });
  }
  else{

    return reply.send(agrupaciones);

}
}
async function obtenerUsuarioPorRut(req, res) {
  try {
    const { rut } = req.params;

    // Obtiene el usuario por su rut
    const usuario = await getUsuarioByRut(rut);
    if (usuario.length === 0) {
      return res.send({ success: false, message: 'No se encontró el usuario' });
    }

    // Retorna el usuario
    res.code(201).send(usuario);
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir
    console.error('Error al obtener el usuario:', error);
    res.code(500).send('Error al obtener el usuario');
  }
}
module.exports = { EmailLogin, VerGrupos, obtenerUsuarioPorRut };
