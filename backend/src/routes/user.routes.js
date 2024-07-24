
const { ObtenerActividadesPorAgrupacion, ObtenerActividades } = require('../controllers/actividad.controller');
const { obtenerUsuarioPorRut } = require('../controllers/user.controller');
const { IsUser } = require('../middlewares/auth.middleware');
module.exports = function(fastify, options, done) {
  fastify.get('/VerActividadesGrupos', ObtenerActividades);
  fastify.post('/usuarioPorRut/:rut', obtenerUsuarioPorRut);
  done();
};