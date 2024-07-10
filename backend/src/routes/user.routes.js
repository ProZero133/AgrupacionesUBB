
const { EmailLogin } = require('../controllers/user.controller');

module.exports = function(fastify, options, done) {
  fastify.post('/EmailLogin', EmailLogin);
  done();
};