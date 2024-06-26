const fastify = require('fastify');

const publicacionController = require('../controllers/publicacion.controller.js');

const app = fastify();

app.get('/publicaciones', publicacionController.getpublicaciones);
app.get('/publicaciones/:id', publicacionController.getpublicacionById);
app.post('/publicaciones', publicacionController.createpublicacion);
app.put('/publicaciones/:id', publicacionController.updatepublicacion);
app.delete('/publicaciones/:id', publicacionController.deletepublicacion);

module.exports = publicacionRoutes;