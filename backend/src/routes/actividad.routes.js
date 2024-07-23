const fastify = require('../config/configFastify.js');

const {ObtenerActividadesPorAgrupacion, ObtenerActividadPorID, ObtenerActividades, crearActividad, updateActividad, deleteActividad} = require('../controllers/actividad.controller.js');


module.exports = function(fastify, options, done) {
    
  fastify.get('/actividades', ObtenerActividades);
  fastify.get('/actividades/:id', ObtenerActividadPorID);
  fastify.get('/actividades/grupo/:id', ObtenerActividadesPorAgrupacion);
  fastify.post('/actividades', crearActividad);
  fastify.put('/actividades/:id', updateActividad);
  fastify.delete('/actividades/:id', deleteActividad);

  done();
};
