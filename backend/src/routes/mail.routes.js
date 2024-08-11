const fastify = require('../config/configFastify.js');
const {crearNotificacion, obtenerNotificacionesUsuario, limpiarNotificacionesUsuario, limpiarNotificacion} = require('../controllers/mail.controller.js');
module.exports = function(fastify, options, done) {
    fastify.post('/crearNotificacion/:rut/:titulo/:descripcion', crearNotificacion);
    fastify.get('/obtenerNotificacionesUsuario/:rut', obtenerNotificacionesUsuario);
    fastify.delete('/limpiarNotificacionesUsuario/:rut', limpiarNotificacionesUsuario);
    fastify.delete('/limpiarNotificacion/:id_noti', limpiarNotificacion);
    done();
};
