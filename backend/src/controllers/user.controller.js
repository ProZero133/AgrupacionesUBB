const { validarUsuario, asignarToken } = require('../services/auth.service');
const { getAgrupaciones, createInvitacion } = require('../services/agrupacion.service');
const { getUsuarioByRut, getTagsSimilares, getPreferenciasUsuario,
  updatePreferenciasUsuario, getTagById, getUsuarioServidor, getUsuarioByCorreo, deletePreferenciaUsuario } = require('../services/user.service');
const { inviteUsuario } = require("../services/mail.service.js");

const { func } = require('joi');

async function EmailLogin(request, reply) {
  const { email } = request.body; // Asume que el correo se envía en el cuerpo de la solicitud
  // Llamar a la base de datos para verificar si el usuario existe
  const result = await validarUsuario(email);
  const usuario = result.user[0];
  if (result.success) {
    asignarToken(request.server, usuario, reply);
  } else {
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

async function obtenerUsuarioPorCorreo(req, res) {
  try {
    const { correo } = req.body;

    // Obtiene el usuario por su rut
    const usuario = await getUsuarioByCorreo(correo);
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

async function ObtenerTagsSimilares(req, res) {
  try {
    const { tag } = req.params;

    // Obtiene los tags similares
    const tags = await getTagsSimilares(tag);
    if (tags.length === 0) {
      return res.send({ success: false, message: 'No se encontraron tags similares' });
    }

    // Retorna los tags similares
    res.code(201).send(tags);
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir
    console.error('Error al obtener los tags similares:', error);
    res.code(500).send('Error al obtener los tags similares');
  }
}
async function ObtenerPreferenciasUsuario(req, res){
    try{
        const { rut } = req.params;
        // Obtiene las preferencias del usuario
        const preferencias = await getPreferenciasUsuario(rut);
        if(preferencias.length === 0){
            return res.send({ success: false, message: 'No se encontraron preferencias para el usuario' });
        }
        // Retorna las preferencias del usuario
        res.code(201).send(preferencias);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener las preferencias del usuario:', error);
        res.code(500).send('Error al obtener las preferencias del usuario');
    }

}
async function ActualizarPreferenciasUsuario(req, res){
    try{
        const { rut } = req.params;
        const { preferencias } = req.body;
        // Actualiza las preferencias del usuario
        const result = await updatePreferenciasUsuario(rut, preferencias);
        if(result.success){
            return res.send({ success: true, message: 'Preferencias actualizadas correctamente' });
        }
        // Retorna un mensaje de error
        res.send({ success: false, message: 'No se pudieron actualizar las preferencias' });
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar las preferencias del usuario:', error);
        res.code(500).send('Error al actualizar las preferencias del usuario');
    }

}
async function ObtenerTag(req, res){
    try{
        const { id } = req.params;
        // Obtiene el tag por su id
        const tag = await getTagById(id);
        if(tag.length === 0){
            return res.send({ success: false, message: 'No se encontró el tag' });
        }
        // Retorna el tag
        res.code(201).send(tag);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener el tag:', error);
        res.code(500).send('Error al obtener el tag');
    }


}
async function obtenerUsuarioServidor(req, res) {
  try{
    const { rut } = req.params;
    const result = await getUsuarioServidor(rut);
    if(result.length === 0){
      return res.send({ success: false, message: 'No se encontró el usuario' });
    }
    return result;

  }
  catch(error){
    console.error('Error al obtener el usuario:', error);
    res.code(500).send('Error al obtener el usuario');
  }
}

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function invitarUsuario(req, res) {
  try {
    const invitacion = {
      id_agr: req.body.id_agr,
      nombre_agr: req.body.nombre_agr,
      rol_agr: rol_agr = generateRandomString(6),
      fecha_integracion: new Date().toISOString(),
      rut: '11.111.111-1',
      correo: req.body.mail
    };

    const usuario = await getUsuarioByCorreo(req.body.mail);
    if (usuario.length === 0) {
      return res.send({ success: false, message: 'No se encontró el usuario:' + req.params.id_agr });
    }
    invitacion.nombre = usuario[0].nombre;

    try {
      const invitacrear = await createInvitacion(invitacion);
    } catch (error) {
      console.error('Error al crear la invitación:', error);
    }

    const invitar = await inviteUsuario(invitacion);

  } catch(error){
    console.error('Error al invitar al usuario:', error);
    res.code(500).send('Error al invitar al usuario');
  }
}

async function EliminarPreferenciaUsuario(req, res){
  try{
    const rut = req.params.rut;
    const id = req.params.id;
    // Elimina la preferencia del usuario
    const result = await deletePreferenciaUsuario(rut, id);
    if(result.success){
      return res.send({ success: true, message: 'Preferencia eliminada correctamente' });
    }
    // Retorna un mensaje de error
    res.send({ success: false, message: 'No se pudo eliminar la preferencia' });
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir
    console.error('Error al eliminar la preferencia del usuario:', error);
    res.code(500).send('Error al eliminar la preferencia del usuario');
  }
}

module.exports = {
  EmailLogin,
  VerGrupos,
  obtenerUsuarioPorRut,
  obtenerUsuarioPorCorreo,
  ObtenerTagsSimilares,
  ObtenerPreferenciasUsuario,
  ActualizarPreferenciasUsuario,
  ObtenerTag,
  obtenerUsuarioServidor,
  invitarUsuario,
  EliminarPreferenciaUsuario
};