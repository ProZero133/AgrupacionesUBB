const fastify = require('../config/configFastify.js');

const { obtenerImagenes, obtenerImagenPorID, crearImagen, eliminarImagen } = require('../controllers/imagenes.controller.js');

module.exports = async function (fastify, opts, done) {
    fastify.get('/imagen', obtenerImagenes);
    fastify.get('/imagen/:id', obtenerImagenPorID);
    fastify.post('/imagen', crearImagen);
    fastify.delete('/imagen/:id', eliminarImagen);
    done();
};