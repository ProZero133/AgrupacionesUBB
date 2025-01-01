const { EmailLogin, TokenAutorizacionController, RutLogin } = require('../controllers/auth.controller');

module.exports = function(fastify, options, done) {
  fastify.post('/EmailLogin', EmailLogin);
  fastify.post('/TokenAutorizacion', TokenAutorizacionController);
  fastify.post('/RutLogin', RutLogin);
  done();
};