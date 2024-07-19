const fastify = require('../config/configFastify.js');

const {ObtenerActividadPorID, ObtenerActividades, createActividad, updateActividad, deleteActividad} = require('../controllers/actividad.controller.js');


module.exports = function(fastify, options, done) {
    
    fastify.get('/actividades', ObtenerActividades);
    fastify.get('/actividades/:id', ObtenerActividadPorID);
    fastify.post('/actividades', createActividad);
    fastify.put('/actividades/:id', updateActividad);
    fastify.delete('/actividades/:id', deleteActividad);

done();
  };
