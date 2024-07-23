const fastify = require('../config/configFastify.js');

const { obtenerPost, obtenerPostPorId, crearPost, actualizarPost, eliminarPost } = require('../controllers/post.controller.js');

module.exports = function (fastify, opts, done) {
    fastify.get('/post', obtenerPost);
    fastify.get('/post/:id', obtenerPostPorId);
    fastify.post('/post', crearPost);
    fastify.put('/post/:id', actualizarPost);
    fastify.delete('/post/:id', eliminarPost);
    
    done();
};