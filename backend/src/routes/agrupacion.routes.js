const fastify = require('fastify');

const agrupacionController = require('../controllers/agrupacion.controller.js');

const app = fastify();

app.get('/agrupaciones', agrupacionController.getAgrupaciones);
app.get('/agrupaciones/:id', agrupacionController.getAgrupacionById);
app.post('/agrupaciones', agrupacionController.createAgrupacion);
app.put('/agrupaciones/:id', agrupacionController.updateAgrupacion);

module.exports = app;