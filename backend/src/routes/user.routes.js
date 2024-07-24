
const { ObtenerActividadesPorAgrupacion, ObtenerActividades } = require('../controllers/actividad.controller');
const { IsUser } = require('../middlewares/auth.middleware');
module.exports = function(fastify, options, done) {
  fastify.get('/VerActividadesGrupos', ObtenerActividades);
  done();
};