const fastify = require('../config/configFastify.js');

const { VerGrupos, ObtenerAgrupacionesPorID, crearAgrupacion, editarAgrupacion, 
  obtenerImagenAgrupacion, unirseAgrupacion, solicitudesAgrupacion, aceptarSolicitud, 
  eliminarAgrupacion, abandonarAgrupacion, rechazarSolicitud, solicitarAcreditacion, ingresarTagsAgrupacion, obtenerLider } = require('../controllers/agrupacion.controller.js');

module.exports = function(fastify, options, done) {
    
  fastify.get('/agrupaciones', VerGrupos);
  fastify.get('/agrupaciones/:id', ObtenerAgrupacionesPorID);
  fastify.post('/agrupaciones', crearAgrupacion);
  fastify.put('/agrupaciones/:id_agr', editarAgrupacion);
  fastify.get('/imagenagrupacion/:id', obtenerImagenAgrupacion);
  fastify.post('/enviarsolicitud/:rut/:id_agr', unirseAgrupacion);
  fastify.get('/versolicitudes/:id_agr', solicitudesAgrupacion);
  fastify.post('/aceptarsolicitud/:rut/:id_agr', aceptarSolicitud);
  fastify.post('/rechazarsolicitud/:rut/:id_agr', rechazarSolicitud);
  fastify.delete('/eliminaragrupacion/:id_agr/:rut', eliminarAgrupacion);
  fastify.delete('/abandonaragrupacion/:id_agr/:rut', abandonarAgrupacion);
  fastify.put('/solicitaracreditacion/:id_agr/:rut', solicitarAcreditacion);
  fastify.post('/ingresartagsagrupacion', ingresarTagsAgrupacion);
  fastify.get('/obtenerlider/:id_agr', obtenerLider);
  done();
};
