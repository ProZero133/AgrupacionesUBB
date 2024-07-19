const fastify = require('../config/configFastify.js');

const { ObtenerAgrupaciones, ObtenerAgrupacionesPorID, createAgrupacion, updateAgrupacion } = require('../controllers/agrupacion.controller.js');

module.exports = function(fastify, options, done) {
    
  fastify.get('/agrupaciones', ObtenerAgrupaciones);
  fastify.get('/agrupaciones/:id', ObtenerAgrupacionesPorID);
  fastify.post('/agrupaciones', createAgrupacion);
  fastify.put('/agrupaciones/:id', updateAgrupacion);
  done();
};