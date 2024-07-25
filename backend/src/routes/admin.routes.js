const { IsAdmin } = require('../middlewares/auth.middleware');
const { ObtenerUsuarios } = require('../controllers/admin.controller');
const { ObtenerAcreditaciones, AcreditaciondeGrupo } = require('../controllers/AcreditacionGrupo.controller');
const { ObtenerUsuariosdeAgrupacion } = require('../controllers/agrupacion.controller');

module.exports = function(fastify, options, done) {
  fastify.get('/usuarios', ObtenerUsuarios);
  fastify.get('/acreditaciones', ObtenerAcreditaciones);
  fastify.put('/acreditaciones/:id_agr', AcreditaciondeGrupo);
  fastify.get('/acreditaciones/:id_agr', ObtenerUsuariosdeAgrupacion); // Devuelve los usuarios que pertenecen a una agrupacion en especifico
  done();
};