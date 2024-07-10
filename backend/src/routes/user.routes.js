
const { EmailLogin } = require('../controllers/user.controller');
const { IsUser } = require('../middlewares/auth.middleware');
module.exports = function(fastify, options, done) {
  fastify.post('/EmailLogin', EmailLogin);
  done();
};