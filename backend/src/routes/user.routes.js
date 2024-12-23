
const { ObtenerActividadesPorAgrupacion, ObtenerActividades,
  ObtenerActividadesPorGrupoUsuario, } = require('../controllers/actividad.controller');
const { obtenerUsuarioPorRut, ObtenerTagsSimilares, ObtenerPreferenciasUsuario, ActualizarPreferenciasUsuario, 
  ObtenerTag, obtenerUsuarioServidor, obtenerUsuarioPorCorreo, invitarUsuario, EliminarPreferenciaUsuario } = require('../controllers/user.controller');
const { obtenerAgrupacionesDeUsuario } = require('../controllers/agrupacion.controller');
const { obtenerPublicacionesPorGrupoUsuario } = require('../controllers/publicacion.controller');
const { isUser, isAdmin, isUserOrAdmin } = require('../middlewares/auth.middleware.js');
module.exports = function(fastify, options, done) {
  fastify.decorate("authenticate", async (request, reply) => {
    try {
      const token = request.cookies.TokenAutorizacion;
      if (!token) {
        return reply.status(401).send({ error: 'No autorizado' });
      }
      const decoded = await fastify.jwt.verify(token);
      request.user = decoded; 
    } catch (err) {
      reply.status(401).send({ error: 'Token inválido' });
    }
  });
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