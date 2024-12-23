const fastify = require('../config/configFastify.js');

const { obtenerImagenes, obtenerImagenPorID, crearImagen, eliminarImagen } = require('../controllers/imagenes.controller.js');
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
    fastify.get('/imagen', { preHandler: [isUserOrAdmin] },obtenerImagenes);
    fastify.get('/imagen/:id', { preHandler: [isUserOrAdmin] },obtenerImagenPorID);
    fastify.post('/imagen', { preHandler: [isUser] },crearImagen);
    fastify.delete('/imagen/:id', { preHandler: [isUserOrAdmin] },eliminarImagen);
    done();
};