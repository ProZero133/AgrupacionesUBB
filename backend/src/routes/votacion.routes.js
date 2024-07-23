const fastify = require('../config/configFastify.js');

const { obtenerVotaciones, obtenerVotacionPorId, crearVotacion, actualizarVotacion, eliminarVotacion } = require('../controllers/votacion.controller.js');

module.exports = function (fastify, opts, done) {
    fastify.get('/votaciones', obtenerVotaciones);
    fastify.get('/votaciones/:id', obtenerVotacionPorId);
    fastify.post('/votaciones', crearVotacion);
    fastify.put('/votaciones/:id', actualizarVotacion);
    fastify.delete('/votaciones/:id', eliminarVotacion);
    done();
};