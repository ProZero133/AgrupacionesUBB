const fastify = require('../config/configFastify.js');

const { VerGrupos, ObtenerAgrupacionesPorID, crearAgrupacion, editarAgrupacion, 
  obtenerImagenAgrupacion, unirseAgrupacion, solicitudesAgrupacion, aceptarSolicitud, 
  eliminarAgrupacion, abandonarAgrupacion, rechazarSolicitud, solicitarAcreditacion, ingresarTagsAgrupacion,
  obtenerLider, ObtenerRolUsuario, VerGruposPorNombre, notificarMiembrosPublicacion, ingresarPorCodigo, VerGruposNoInscritos, ObtenerTagsAgrupacion, obtenerLiderArray,
  eliminarTagAgrupacion,obtenerAgrupacionesPertenece, invitarUsuario, obtenerAparienciaAgrupacion, actualizarAparienciaAgrupacion,
  actualizarRedesSociales } = require('../controllers/agrupacion.controller.js');
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
    
  fastify.get('/agrupaciones',{ preHandler: [isUserOrAdmin] },VerGrupos);
  fastify.get('/agrupaciones/:id', { preHandler: [isUserOrAdmin] },ObtenerAgrupacionesPorID);
  fastify.post('/agrupaciones', { preHandler: [isUser] },crearAgrupacion);
  fastify.put('/agrupaciones/:id_agr', { preHandler: [isUserOrAdmin] },editarAgrupacion);
  fastify.get('/imagenagrupacion/:id', { preHandler: [isUserOrAdmin] },obtenerImagenAgrupacion);
  fastify.post('/enviarsolicitud/:rut/:id_agr', unirseAgrupacion);
  fastify.get('/versolicitudes/:id_agr', { preHandler: [isUserOrAdmin] },solicitudesAgrupacion);
  fastify.post('/aceptarsolicitud/:rut/:id_agr', { preHandler: [isUserOrAdmin] },aceptarSolicitud);
  fastify.post('/rechazarsolicitud/:rut/:id_agr', { preHandler: [isUserOrAdmin] },rechazarSolicitud);
  fastify.delete('/eliminaragrupacion/:id_agr', { preHandler: [isUserOrAdmin] },eliminarAgrupacion);
  fastify.delete('/abandonaragrupacion/:id_agr/:rut', { preHandler: [isUserOrAdmin] },abandonarAgrupacion);
  fastify.put('/solicitaracreditacion/:id_agr', { preHandler: [isUser] },solicitarAcreditacion);
  fastify.post('/ingresartagsagrupacion', { preHandler: [isUser] },ingresarTagsAgrupacion);
  fastify.get('/agrupacionesNombre/:nombre_agr', { preHandler: [isUserOrAdmin] },VerGruposPorNombre);
  fastify.get('/obtenerLider/:id_agr', { preHandler: [isUserOrAdmin] },obtenerLider);
  fastify.get('/LiderArray/:id_agr', { preHandler: [isUserOrAdmin] },obtenerLiderArray);
  fastify.get('/obtenerRolUsuario/:rut/:id_agr', { preHandler: [isUserOrAdmin] },ObtenerRolUsuario);
  fastify.post('/notificarMiembrosPublicacion', { preHandler: [isUserOrAdmin] },notificarMiembrosPublicacion);
  fastify.post('/ingresarPorCodigo',{ preHandler: [isUser] }, ingresarPorCodigo);
  fastify.get('/agrupacionesnoinscritas/:rut',{ preHandler: [isUser] }, VerGruposNoInscritos);
  fastify.get('/obtenerTagsAgrupacion/:id_agr',{ preHandler: [isUserOrAdmin] }, ObtenerTagsAgrupacion);
  fastify.delete('/eliminarTagAgrupacion/:id_agr/:id_tag',{ preHandler: [isUserOrAdmin] }, eliminarTagAgrupacion);
  fastify.get('/agrupacionesPertenece/:rut',{ preHandler: [isUserOrAdmin] }, obtenerAgrupacionesPertenece);
  fastify.post('/invitarUsuario', { preHandler: [isUserOrAdmin] },invitarUsuario);
  fastify.get('/apariencia/:id_agr', { preHandler: [isUserOrAdmin] },obtenerAparienciaAgrupacion);
  fastify.put('/apariencia/:id_agr', { preHandler: [isUser] },actualizarAparienciaAgrupacion);
  fastify.put('/redesSociales/:id_agr', { preHandler: [isUser] },actualizarRedesSociales);
  done();
};
