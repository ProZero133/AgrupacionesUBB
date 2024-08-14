const { IsAdmin } = require('../middlewares/auth.middleware');
const { ObtenerUsuarios } = require('../controllers/admin.controller');
const { ObtenerAcreditaciones, AceptacionAcreditaciondeGrupo, RechazoAcreditaciondeGrupo } = require('../controllers/AcreditacionGrupo.controller');
const { ObtenerUsuariosdeAgrupacion, ObtenerRolUsuario, CambiarRoldeUsuario } = require('../controllers/agrupacion.controller');
const { AceptacionActividad } = require('../controllers/actividad.controller');

module.exports = function(fastify, options, done) {
  fastify.get('/usuarios', ObtenerUsuarios);
  fastify.get('/acreditaciones', ObtenerAcreditaciones);
  fastify.put('/aceptacionAcr/:id_agr', AceptacionAcreditaciondeGrupo);
  fastify.put('/rechazoAcr/:id_agr', RechazoAcreditaciondeGrupo);
  fastify.get('/administracionderoles/:id_agr', ObtenerUsuariosdeAgrupacion); // Devuelve los usuarios que pertenecen a una agrupacion en especifico
  fastify.get('/obtencionderoles/:id_agr/:rut', ObtenerRolUsuario); // Devuelve los usuarios que pertenecen a una agrupacion en especifico
  fastify.put('/administracionderoles/:id_agr/:rut', CambiarRoldeUsuario); // Cambia el rol de un usuario en una agrupacion
  fastify.put('/aceptacionAct/:id_act', AceptacionActividad);

  done();
};