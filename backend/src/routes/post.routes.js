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

    fastify.get('/post',{ preHandler: [isUserOrAdmin] }, obtenerPosts);
    fastify.get('/post/:id',{ preHandler: [isUserOrAdmin] }, obtenerPostPorId);
    fastify.post('/post', { preHandler: [isUser] },crearPost);
    fastify.delete('/post/:id', { preHandler: [isUserOrAdmin] },eliminarPost);
    
    done();
};