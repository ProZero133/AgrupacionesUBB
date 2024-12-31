const fastify = require('../config/configFastify.js');

const {
  ObtenerActividadesPorAgrupacion,
  ObtenerActividadyAgrupacion,
  ObtenerActividadPorID,
  ObtenerActividades,
  crearActividad,
  updateActividad,
  ObtenerCreadorActividad,
  eliminarActividad,
  rechazarActividad,
  programarActividad,
  participarActividad,
  obtenerActividadesParticipante,
  abandonarActividad,
  eliminarActividadPublica,
  ObtenerActividadesPublicas,
  obtenerParticipantesActividad
} = require('../controllers/actividad.controller.js');
const { isUser, isAdmin, isUserOrAdmin } = require('../middlewares/auth.middleware.js');

module.exports = function (fastify, options, done) {
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

  fastify.get('/actividades',{ preHandler: [isUserOrAdmin] }, ObtenerActividades);
  fastify.get('/ActAgr',{ preHandler: [isUserOrAdmin] }, ObtenerActividadyAgrupacion);
  fastify.get('/actividades/:id', { preHandler: [isUserOrAdmin] },ObtenerActividadPorID);
  fastify.get('/actividadesgrupo/:id', { preHandler: [isUserOrAdmin] },ObtenerActividadesPorAgrupacion);
  fastify.post('/programar/:id_act/:id_agr', { preHandler: [isUser] },programarActividad);
  fastify.post('/participar/:id_act/:rut', { preHandler: [isUser] },participarActividad);
  fastify.post('/actividades',{ preHandler: [isUser] }, crearActividad);
  fastify.put('/actividades/:id', { preHandler: [isUser] },updateActividad);
  fastify.delete('/actividades/:id_act', { preHandler: [isUserOrAdmin] },eliminarActividad);
  fastify.delete('/borrarActividades/:id_act/:rut', { preHandler: [isAdmin] },eliminarActividadPublica);
  fastify.get('/obtenerCreador/:id_act', { preHandler: [isUserOrAdmin] },ObtenerCreadorActividad);
  fastify.delete('/rechazarActividad/:id_act', { preHandler: [isAdmin] },rechazarActividad);
  fastify.get('/actividadesparticipante/:rut', { preHandler: [isUserOrAdmin] },obtenerActividadesParticipante);
  fastify.post('/abandonaractividad/:id_act/:rut', { preHandler: [isUser] },abandonarActividad);
  fastify.get('/actividadesPublicas', { preHandler: [isUserOrAdmin] },ObtenerActividadesPublicas);
  fastify.get('/obtenerParticipantes/:id_act', { preHandler: [isUserOrAdmin] },obtenerParticipantesActividad);
  done();
};
