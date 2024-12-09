const fastify = require('../config/configFastify.js');

const { obtenerPosts, obtenerPostPorId, crearPost, actualizarPost, eliminarPost } = require('../controllers/post.controller.js');

module.exports = function (fastify, opts, done) {
    fastify.get('/post', obtenerPosts);
    fastify.get('/post/:id', obtenerPostPorId);
    fastify.post('/post', crearPost);
    fastify.delete('/post/:id', eliminarPost);
    
    done();
};