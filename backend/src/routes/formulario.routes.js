const fastify = require('../config/configFastify.js');

const { getFormulario, getFormularios, createFormulario, updateFormulario, deleteFormulario } = require('../controllers/formulario.controller.js');

module.exports = async function (fastify, opts, done) {
    fastify.get('/formularios', getFormularios);
    fastify.get('/formulario/:id', getFormulario);
    fastify.post('/formulario', createFormulario);
    fastify.put('/formulario/:id', updateFormulario);
    fastify.delete('/formulario/:id', deleteFormulario);
    done();
};