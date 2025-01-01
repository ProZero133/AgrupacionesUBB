
const { ObtenerActividadesPorAgrupacion, ObtenerActividades,
  ObtenerActividadesPorGrupoUsuario, } = require('../controllers/actividad.controller');
const { obtenerUsuarioPorRut, ObtenerTagsSimilares, ObtenerPreferenciasUsuario, ActualizarPreferenciasUsuario, 
  ObtenerTag, obtenerUsuarioServidor, obtenerUsuarioPorCorreo, EliminarPreferenciaUsuario } = require('../controllers/user.controller');
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

  fastify.get('/VerActividadesGruposUsuario/:rut', { preHandler: [isUserOrAdmin] },ObtenerActividadesPorGrupoUsuario);
  fastify.get('/VerPublicacionesGruposUsuario/:rut', { preHandler: [isUserOrAdmin] },obtenerPublicacionesPorGrupoUsuario);
  fastify.get('/usuarioPorRut/:rut', { preHandler: [isUserOrAdmin] },obtenerUsuarioPorRut);
  fastify.post('/usuarioPorCorreo/:correo', { preHandler: [isUserOrAdmin] },obtenerUsuarioPorCorreo);
  fastify.get('/usuarioServidor/:rut', { preHandler: [isUserOrAdmin] },obtenerUsuarioServidor);
  fastify.get('/buscarTags/:tag', { preHandler: [isUserOrAdmin] },ObtenerTagsSimilares);
  fastify.get('/obtenerPreferencias/:rut', { preHandler: [isUser] },ObtenerPreferenciasUsuario);
  fastify.post('/actualizarPreferencias/:rut', { preHandler: [isUser] },ActualizarPreferenciasUsuario);
  fastify.get('/obtenerTagPorId/:id', { preHandler: [isUserOrAdmin] },ObtenerTag);
  fastify.get('/obtenerGruposUsuario/:rut', { preHandler: [isUserOrAdmin] },obtenerAgrupacionesDeUsuario);
  fastify.delete('/eliminarPreferencia/:rut/:id', { preHandler: [isUser] },EliminarPreferenciaUsuario);
  done();
};