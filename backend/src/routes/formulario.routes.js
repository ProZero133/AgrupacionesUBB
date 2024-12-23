const fastify = require('../config/configFastify.js');

const { obtenerFormularios, obtenerFormularioPorId, crearFormulario, actualizarFormulario, eliminarFormulario } = require('../controllers/formulario.controller.js');
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
    fastify.get('/formulario',{ preHandler: [isUserOrAdmin] }, obtenerFormularios);
    fastify.get('/formulario/:id', { preHandler: [isUserOrAdmin] },obtenerFormularioPorId);
    fastify.post('/formulario', { preHandler: [isUser] },crearFormulario);
    fastify.put('/formulario/:id', { preHandler: [isUser] },actualizarFormulario);
    fastify.delete('/formulario/:id', { preHandler: [isUserOrAdmin] },eliminarFormulario);
    done();
};