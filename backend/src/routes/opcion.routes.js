const fastify = require('../config/configFastify.js');

const { obtenerOpciones, obtenerOpcionPorId, crearOpcion, actualizarOpcion, eliminarOpcion } = require('../controllers/opcion.controller.js');

module.exports = function(fastify, options, done) {
    fastify.get('/opcion', obtenerOpciones);
    fastify.get('/opcion/:id', obtenerOpcionPorId);
    fastify.post('/opcion', crearOpcion);
    fastify.delete('/opcion/:id', eliminarOpcion);
    done();
}
