const { IsAdmin } = require('../middlewares/auth.middleware');
const { ObtenerUsuarios } = require('../controllers/admin.controller');
const { ObtenerAcreditaciones, AcreditaciondeGrupo } = require('../controllers/AcreditacionGrupo.controller');
const { ObtenerUsuariosdeAgrupacion, ObtenerRolUsuario, CambiarRoldeUsuario } = require('../controllers/agrupacion.controller');

module.exports = function(fastify, options, done) {
  fastify.get('/usuarios', ObtenerUsuarios);
  fastify.get('/acreditaciones', ObtenerAcreditaciones);
  fastify.put('/acreditaciones/:id_agr', AcreditaciondeGrupo);
  fastify.get('/administracionderoles/:id_agr', ObtenerUsuariosdeAgrupacion); // Devuelve los usuarios que pertenecen a una agrupacion en especifico
  fastify.get('/obtencionderoles/:id_agr/:rut', ObtenerRolUsuario); // Devuelve los usuarios que pertenecen a una agrupacion en especifico
  fastify.put('/administracionderoles/:id_agr/:rut', CambiarRoldeUsuario); // Cambia el rol de un usuario en una agrupacion
  done();
};