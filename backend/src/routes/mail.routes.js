const fastify = require('../config/configFastify.js');
const {crearNotificacion, obtenerNotificacionesUsuario, limpiarNotificacionesUsuario, limpiarNotificacion} = require('../controllers/mail.controller.js');
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
    fastify.post('/crearNotificacion/:rut/:titulo/:descripcion', { preHandler: [isUser] },crearNotificacion);
    fastify.get('/obtenerNotificacionesUsuario/:rut', { preHandler: [isUser] },obtenerNotificacionesUsuario);
    fastify.delete('/limpiarNotificacionesUsuario/:rut', { preHandler: [isUser] },limpiarNotificacionesUsuario);
    fastify.delete('/limpiarNotificacion/:id_noti', { preHandler: [isUser] },limpiarNotificacion);
    done();
};
