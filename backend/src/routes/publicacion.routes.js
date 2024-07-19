const fastify = require('../config/configFastify.js');

const { getpublicacionById, getpublicaciones, createpublicacion, updatepublicacion, deletepublicacion } = require('../controllers/publicacion.controller.js');

module.exports = function(fastify, options, done) {
fastify.get('/publicaciones', getpublicaciones);
fastify.get('/publicaciones/:id', getpublicacionById);
fastify.post('/publicaciones', createpublicacion);
fastify.put('/publicaciones/:id', updatepublicacion);
fastify.delete('/publicaciones/:id', deletepublicacion);

done();
}