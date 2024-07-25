const fastify = require('../config/configFastify.js');

const {ObtenerActividadesPorAgrupacion, ObtenerActividadPorID, ObtenerActividades, crearActividad, updateActividad, deleteActividad, programarActividad, participarActividad} = require('../controllers/actividad.controller.js');


module.exports = function(fastify, options, done) {
    
  fastify.get('/actividades', ObtenerActividades);
  fastify.get('/actividades/:id', ObtenerActividadPorID);
  fastify.get('/actividadesgrupo/:id', ObtenerActividadesPorAgrupacion);
  fastify.post('/programar/:id_act/:id_agr', programarActividad);
  fastify.post('/participar/:id_act/:rut', participarActividad);
  fastify.post('/actividades', crearActividad);
  fastify.put('/actividades/:id', updateActividad);
  fastify.delete('/actividades/:id', deleteActividad);

  done();
};
