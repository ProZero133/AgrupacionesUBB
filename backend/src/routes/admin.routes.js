const { IsAdmin } = require('../middlewares/auth.middleware');
const { ObtenerUsuarios } = require('../controllers/admin.controller');
const { ObtenerAcreditaciones, AcreditaciondeGrupo } = require('../controllers/AcreditacionGrupo.controller');

module.exports = function(fastify, options, done) {
  fastify.get('/usuarios', ObtenerUsuarios);
  fastify.get('/acreditaciones', ObtenerAcreditaciones);
  fastify.put('/acreditaciones/:id_agr', AcreditaciondeGrupo);
  done();
};