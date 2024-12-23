
const { ObtenerActividadesPorAgrupacion, ObtenerActividades,
  ObtenerActividadesPorGrupoUsuario, } = require('../controllers/actividad.controller');
const { obtenerUsuarioPorRut, ObtenerTagsSimilares, ObtenerPreferenciasUsuario, ActualizarPreferenciasUsuario, 
  ObtenerTag, obtenerUsuarioServidor, obtenerUsuarioPorCorreo, invitarUsuario, EliminarPreferenciaUsuario } = require('../controllers/user.controller');
const { obtenerAgrupacionesDeUsuario } = require('../controllers/agrupacion.controller');
const { obtenerPublicacionesPorGrupoUsuario } = require('../controllers/publicacion.controller');

module.exports = function(fastify, options, done) {
  fastify.get('/VerActividadesGruposUsuario/:rut', ObtenerActividadesPorGrupoUsuario);
  fastify.get('/VerPublicacionesGruposUsuario/:rut', obtenerPublicacionesPorGrupoUsuario);
  fastify.post('/usuarioPorRut/:rut', obtenerUsuarioPorRut);
  fastify.post('/usuarioPorCorreo/:correo', obtenerUsuarioPorCorreo);
  fastify.get('/usuarioServidor/:rut', obtenerUsuarioServidor);
  fastify.get('/buscarTags/:tag', ObtenerTagsSimilares);
  fastify.get('/obtenerPreferencias/:rut', ObtenerPreferenciasUsuario);
  fastify.post('/actualizarPreferencias/:rut', ActualizarPreferenciasUsuario);
  fastify.get('/obtenerTagPorId/:id', ObtenerTag);
  fastify.get('/obtenerGruposUsuario/:rut', obtenerAgrupacionesDeUsuario);
  fastify.post('/invitarUsuario', invitarUsuario);
  fastify.delete('/eliminarPreferencia/:rut/:id', EliminarPreferenciaUsuario);
  done();
};