const fastify = require('../config/configFastify.js');

const { VerGrupos, ObtenerAgrupacionesPorID, crearAgrupacion, editarAgrupacion, 
  obtenerImagenAgrupacion, unirseAgrupacion, solicitudesAgrupacion, aceptarSolicitud, 
  eliminarAgrupacion, abandonarAgrupacion } = require('../controllers/agrupacion.controller.js');

module.exports = function(fastify, options, done) {
    
  fastify.get('/agrupaciones', VerGrupos);
  fastify.get('/agrupaciones/:id', ObtenerAgrupacionesPorID);
  fastify.post('/agrupaciones', crearAgrupacion);
  fastify.put('/agrupaciones/:id', editarAgrupacion);
  fastify.get('/imagenagrupacion/:id', obtenerImagenAgrupacion);
  fastify.post('/enviarsolicitud/:rut/:id_agr', unirseAgrupacion);
  fastify.get('/versolicitudes/:id_agr', solicitudesAgrupacion);
  fastify.post('/aceptarsolicitud/:rut/:id_agr', aceptarSolicitud);
  fastify.post('/eliminaragrupacion/:id_agr/:rut', eliminarAgrupacion);
  fastify.post('/abandonaragrupacion/:id_agr/:rut', abandonarAgrupacion);
  done();
};