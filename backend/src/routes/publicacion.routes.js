const fastify = require('../config/configFastify.js');

const { obtenerPublicaciones, obtenerPublicacionesPorId, crearPublicacion, actualizarPublicacion, eliminarPublicacion, obtenerPublicacionesPorGrupo } = require('../controllers/publicacion.controller.js');

module.exports = function(fastify, options, done) {
    fastify.get('/publicaciones', obtenerPublicaciones);
    fastify.get('/publicaciones/:id', obtenerPublicacionesPorId);
    fastify.get('/publicacionesgrupo/:id', obtenerPublicacionesPorGrupo);
    fastify.post('/publicaciones', crearPublicacion);
    fastify.put('/publicaciones/:id', actualizarPublicacion);
    fastify.delete('/publicaciones/:id', eliminarPublicacion);
    done();
}
