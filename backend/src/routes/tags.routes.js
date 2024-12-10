const fastify = require('../config/configFastify.js');

const { obtenerTags, obtenerTagPorId, crearTag, editarTag, eliminarTag } = require('../controllers/tags.controller.js');

module.exports = function(fastify, options, done) {
    fastify.get('/tags', obtenerTags);
    fastify.get('/tags/:id', obtenerTagPorId);
    fastify.post('/tags', crearTag);
    fastify.delete('/tags/:id', eliminarTag);
    done();
}
