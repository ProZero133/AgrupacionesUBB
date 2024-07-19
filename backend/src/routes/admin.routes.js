const { IsAdmin } = require('../middlewares/auth.middleware');
const { ObtenerUsuarios } = require('../controllers/admin.controller');
module.exports = function(fastify, options, done) {
  fastify.get('/usuarios', ObtenerUsuarios, IsAdmin);
  done();
};