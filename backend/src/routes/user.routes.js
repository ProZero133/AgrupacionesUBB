
const { ObtenerActividadesPorAgrupacion, ObtenerActividades, ObtenerActividadesPorGrupoUsuario } = require('../controllers/actividad.controller');
const { obtenerUsuarioPorRut, ObtenerTagsSimilares, ObtenerPreferenciasUsuario, ActualizarPreferenciasUsuario, ObtenerTag, obtenerUsuarioServidor } = require('../controllers/user.controller');
const { IsUser } = require('../middlewares/auth.middleware');
module.exports = function(fastify, options, done) {
  fastify.get('/VerActividadesGruposUsuario/:rut', ObtenerActividadesPorGrupoUsuario);
  fastify.post('/usuarioPorRut/:rut', obtenerUsuarioPorRut);
  fastify.get('/usuarioServidor/:rut', obtenerUsuarioServidor);
  fastify.get('/buscarTags/:tag', ObtenerTagsSimilares);
  fastify.get('/obtenerPreferencias/:rut', ObtenerPreferenciasUsuario);
  fastify.post('/actualizarPreferencias/:rut', ActualizarPreferenciasUsuario);
  fastify.get('/obtenerTagPorId/:id', ObtenerTag);
  done();
};