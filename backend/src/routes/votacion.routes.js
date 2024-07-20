const fastify = require('../config/configFastify.js');

const { getVotaciones, getVotacion, createVotacion, updateVotacion, deleteVotacion } = require('../controllers/votacion.controller.js');

module.exports = async function (fastify, opts, done) {
    fastify.get('/votaciones', getVotaciones);
    fastify.get('/votaciones/:id', getVotacion);
    fastify.post('/votaciones', createVotacion);
    fastify.put('/votaciones/:id', updateVotacion);
    fastify.delete('/votaciones/:id', deleteVotacion);
    done();
};