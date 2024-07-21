const fastify = require('../config/configFastify.js');

const { getOpciones, getOpcionById, postOpcion, updateOpcion, deleteOpcion } = require('../controllers/opcion.controller.js');

fastify.get('/api/opciones', getOpciones);
fastify.get('/api/opcion/:id', getOpcionById);
fastify.post('/api/opcion', postOpcion);
fastify.put('/api/opcion/:id', updateOpcion);
fastify.delete('/api/opcion/:id', deleteOpcion);

module.exports = fastify;