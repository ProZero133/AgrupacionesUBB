const { IsAdmin } = require('../middlewares/auth.middleware');
const { ObtenerUsuarios } = require('../controllers/admin.controller');
const { ObtenerAcreditaciones } = require('../controllers/AcreditacionGrupo.controller');

module.exports = function(fastify, options, done) {
  fastify.get('/usuarios', ObtenerUsuarios);
  fastify.get('/acreditaciones', ObtenerAcreditaciones);
  done();
};