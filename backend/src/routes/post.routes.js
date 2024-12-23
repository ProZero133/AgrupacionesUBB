const fastify = require('../config/configFastify.js');

const { obtenerPosts, obtenerPostPorId, crearPost, actualizarPost, eliminarPost } = require('../controllers/post.controller.js');
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

    fastify.get('/post', obtenerPosts);
    fastify.get('/post/:id', obtenerPostPorId);
    fastify.post('/post', crearPost);
    fastify.delete('/post/:id', eliminarPost);
    
    done();
};