const fastify = require('../config/configFastify.js');

const { getVotaciones, getVotacionById, createVotacion, updateVotacion, deleteVotacion } = require('../controllers/votacion.controller.js');

module.exports = function (fastify, opts, done) {
    fastify.get('/votaciones', getVotaciones);
    fastify.get('/votaciones/:id', getVotacionById);
    fastify.post('/votaciones', createVotacion);
    fastify.put('/votaciones/:id', updateVotacion);
    fastify.delete('/votaciones/:id', deleteVotacion);
    done();
};