const { EmailLogin, validarTokenController } = require('../controllers/auth.controller');

module.exports = function(fastify, options, done) {
  fastify.post('/EmailLogin', EmailLogin);
  //astify.get('/validarToken', validarTokenController);
  done();
};