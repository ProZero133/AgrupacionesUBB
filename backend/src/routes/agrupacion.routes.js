const fastify = require('../config/configFastify.js');

const { VerGrupos, ObtenerAgrupacionesPorID, crearAgrupacion, editarAgrupacion, 
  obtenerImagenAgrupacion, unirseAgrupacion, solicitudesAgrupacion, aceptarSolicitud, 
  eliminarAgrupacion, abandonarAgrupacion, rechazarSolicitud, solicitarAcreditacion, ingresarTagsAgrupacion,
  obtenerLider, ObtenerRolUsuario, VerGruposPorNombre, notificarMiembrosPublicacion, ingresarPorCodigo, VerGruposNoInscritos, ObtenerTagsAgrupacion, obtenerLiderArray,
  eliminarTagAgrupacion } = require('../controllers/agrupacion.controller.js');
const { eliminarTag } = require('../controllers/tags.controller.js');

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
  fastify.get('/agrupacionesNombre/:nombre_agr', VerGruposPorNombre);
  fastify.get('/obtenerLider/:id_agr', obtenerLider);
  fastify.get('/LiderArray/:id_agr', obtenerLiderArray);
  fastify.get('/obtenerRolUsuario/:rut/:id_agr', ObtenerRolUsuario);
  fastify.post('/notificarMiembrosPublicacion', notificarMiembrosPublicacion);
  fastify.post('/ingresarPorCodigo/:rut/:codigo', ingresarPorCodigo);
  fastify.get('/agrupacionesnoinscritas/:rut', VerGruposNoInscritos);
  fastify.get('/obtenerTagsAgrupacion/:id_agr', ObtenerTagsAgrupacion);
  fastify.delete('/eliminarTagAgrupacion/:id_agr/:id_tag', eliminarTagAgrupacion);
  done();
};
