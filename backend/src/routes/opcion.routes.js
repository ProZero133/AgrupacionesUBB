const fastify = require('../config/configFastify.js');

const { getOpciones, getOpcionById, postOpcion, updateOpcion, deleteOpcion } = require('../controllers/opcion.controller.js');

module.exports = function(fastify, options, done) {

fastify.get('/opciones', getOpciones);
fastify.get('/opcion/:id', getOpcionById);
//fastify.post('/opcion', postOpcion);
fastify.put('/opcion/:id', updateOpcion);
fastify.delete('/opcion/:id', deleteOpcion);

done();
};