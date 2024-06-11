const fastify = require('fastify');

const actividadController = require('../controllers/actividad.controller.js');

const app = fastify();

app.get('/actividades', actividadController.getActividades);
app.get('/actividades/:id', actividadController.getActividadById);
app.post('/actividades', actividadController.createActividad);
app.put('/actividades/:id', actividadController.updateActividad);
app.delete('/actividades/:id', actividadController.deleteActividad);

module.exports = app;