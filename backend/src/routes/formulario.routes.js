const fastify = require('../config/configFastify.js');

const { obtenerFormularios, obtenerFormularioPorId, crearFormulario, actualizarFormulario, eliminarFormulario } = require('../controllers/formulario.controller.js');

module.exports = function (fastify, opts, done) {
    fastify.get('/formulario', obtenerFormularios);
    fastify.get('/formulario/:id', obtenerFormularioPorId);
    fastify.post('/formulario', crearFormulario);
    fastify.put('/formulario/:id', actualizarFormulario);
    fastify.delete('/formulario/:id', eliminarFormulario);
    done();
};