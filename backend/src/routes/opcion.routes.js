const fastify = require('../config/configFastify.js');

const { obtenerOpciones, obtenerOpcionPorId, crearOpcion, actualizarOpcion, eliminarOpcion } = require('../controllers/opcion.controller.js');
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
    fastify.get('/opcion', obtenerOpciones);
    fastify.get('/opcion/:id', obtenerOpcionPorId);
    fastify.post('/opcion', crearOpcion);
    fastify.delete('/opcion/:id', eliminarOpcion);
    done();
}
