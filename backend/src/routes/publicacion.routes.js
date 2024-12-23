const fastify = require('../config/configFastify.js');

const { obtenerPublicaciones, obtenerPublicacionesPorId, crearPublicacion, actualizarPublicacion, eliminarPublicacion, obtenerPublicacionesPorGrupo } = require('../controllers/publicacion.controller.js');
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
    fastify.get('/publicaciones', obtenerPublicaciones);
    fastify.get('/publicaciones/:id', obtenerPublicacionesPorId);
    fastify.get('/publicacionesgrupo/:id', obtenerPublicacionesPorGrupo);
    fastify.post('/publicaciones', crearPublicacion);
    fastify.delete('/publicaciones/:id', eliminarPublicacion);
    done();
}
