const fastify = require('../config/configFastify.js');

const { getAgrupacionById, getAgrupaciones, createAgrupacion, updateAgrupacion } = require('../controllers/agrupacion.controller.js');

module.exports = function(fastify, options, done) {
    
  fastify.get('/agrupaciones', getAgrupaciones);
  fastify.get('/agrupaciones/:id', getAgrupacionById);
  fastify.post('/agrupaciones', createAgrupacion);
  fastify.put('/agrupaciones/:id', updateAgrupacion);
  done();
};