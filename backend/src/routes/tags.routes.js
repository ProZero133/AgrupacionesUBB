const fastify = require('../config/configFastify.js');

const { obtenerTags, obtenerTagPorId, crearTag, editarTag, eliminarTag } = require('../controllers/tags.controller.js');
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
    fastify.get('/tags', obtenerTags);
    fastify.get('/tags/:id', obtenerTagPorId);
    fastify.post('/tags', crearTag);
    fastify.delete('/tags/:id', eliminarTag);
    done();
}
