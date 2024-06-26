const fastify = require('fastify')();
const { EmailLogin } = require('../controllers/user.controller');

// Registrar la ruta y asociarla con el controlador EmailLogin
module.exports = function(fastify, options, done) {
    fastify.post('/EmailLogin', EmailLogin);
    done();
  };