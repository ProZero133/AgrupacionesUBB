const fastify = require('../config/configFastify.js');

const { obtenerFormularios, obtenerFormularioPorId, crearFormulario, actualizarFormulario, eliminarFormulario } = require('../controllers/formulario.controller.js');

module.exports = async function (fastify, opts, done) {
    fastify.get('/formularios', obtenerFormularios);
    fastify.get('/formularios/:id', obtenerFormularioPorId);
    fastify.post('/formularios', crearFormulario);
    fastify.put('/formularios/:id', actualizarFormulario);
    fastify.delete('/formularios/:id', eliminarFormulario);
    done();
};