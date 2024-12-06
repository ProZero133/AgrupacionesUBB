const fastify = require('../config/configFastify.js');

const {ObtenerActividadesPorAgrupacion, ObtenerActividadyAgrupacion, ObtenerActividadPorID, ObtenerActividades, crearActividad, updateActividad, 
  eliminarActividad, programarActividad, participarActividad, obtenerActividadesParticipante, abandonarActividad, ObtenerActividadesPublicas} = require('../controllers/actividad.controller.js');


module.exports = function(fastify, options, done) {
    
  fastify.get('/actividades', ObtenerActividades);
  fastify.get('/ActAgr', ObtenerActividadyAgrupacion);
  fastify.get('/actividades/:id', ObtenerActividadPorID);
  fastify.get('/actividadesgrupo/:id', ObtenerActividadesPorAgrupacion);
  fastify.post('/programar/:id_act/:id_agr', programarActividad);
  fastify.post('/participar/:id_act/:rut', participarActividad);
  fastify.post('/actividades', crearActividad);
  fastify.put('/actividades/:id', updateActividad);
  fastify.delete('/actividades/:id_act/:rut', eliminarActividad);
  fastify.get('/actividadesparticipante/:rut', obtenerActividadesParticipante);
  fastify.post('/abandonaractividad/:id_act/:rut', abandonarActividad);
  fastify.get('/actividadesPublicas', ObtenerActividadesPublicas);
  done();
};
