const fastify = require('../config/configFastify.js');

const { getFormularioById, getFormularios, createFormulario, updateFormulario, deleteFormulario } = require('../controllers/formulario.controller.js');

module.exports = async function (fastify, opts) {
    fastify.get('/formularios', getFormularios);
    fastify.get('/formulario/:id', getFormularioById);
    fastify.post('/formulario', createFormulario);
    fastify.put('/formulario/:id', updateFormulario);
    fastify.delete('/formulario/:id', deleteFormulario);
};