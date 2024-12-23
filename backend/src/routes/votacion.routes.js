const fastify = require('../config/configFastify.js');

const { obtenerVotaciones, obtenerVotacionPorId, crearVotacion, actualizarVotacion, eliminarVotacion } = require('../controllers/votacion.controller.js');
const { isUser, isAdmin, isUserOrAdmin } = require('../middlewares/auth.middleware.js');
module.exports = function (fastify, opts, done) {
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
    fastify.get('/votaciones', obtenerVotaciones);
    fastify.get('/votaciones/:id', obtenerVotacionPorId);
    fastify.post('/votaciones', crearVotacion);
    fastify.put('/votaciones/:id', actualizarVotacion);
    fastify.delete('/votaciones/:id', eliminarVotacion);
    done();
};