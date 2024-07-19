const fastify = require('fastify')();
const config = require('../config/configEnv.js');
const fastifyCookie = require('@fastify/cookie');

const login = require('../routes/auth.routes');
const user = require('../routes/user.routes');
const fastifyCors = require('@fastify/cors');
const secret = config.JWT_SECRET;
const cookieSecret = config.COOKIE_SECRET;
const url = config.URL;

fastify.register(fastifyCors, {
    // Configura los orígenes permitidos
    origin: url
  });
  fastify.register(fastifyCookie, {
    secret: cookieSecret,
  });
  fastify.register(require('@fastify/jwt'), {
    secret: secret // Asegúrate de usar una clave secreta segura y almacenarla de forma segura
  });
  fastify.register(login);
  fastify.register(user);
module.exports = fastify;