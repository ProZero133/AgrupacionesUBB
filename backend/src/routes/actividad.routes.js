const fastify = require('../config/configFastify.js');

const {getActividadById, getActividades, createActividad, updateActividad, deleteActividad} = require('../controllers/actividad.controller.js');


module.exports = function(fastify, options, done) {
    
    fastify.get('/actividades', getActividades);
    fastify.get('/actividades/:id', getActividadById);
    fastify.post('/actividades', createActividad);
    fastify.put('/actividades/:id', updateActividad);
    fastify.delete('/actividades/:id', deleteActividad);

done();
  };
