const fastify = require('fastify')({ bodyLimit: 1572864 });
const config = require('../config/configEnv.js');
const fastifyCookie = require('@fastify/cookie');
const fastifyMultipart = require('@fastify/multipart');
const login = require('../routes/auth.routes');
const user = require('../routes/user.routes');
const formulario = require('../routes/formulario.routes');
const post = require('../routes/post.routes');
const agrupacion = require('../routes/agrupacion.routes');
const actividad = require('../routes/actividad.routes');
const publicacion = require('../routes/publicacion.routes');
const imagenes = require('../routes/imagenes.routes');
const acreditaciones = require('../routes/admin.routes');
const tag  = require('../routes/tags.routes');
const fastifyCors = require('@fastify/cors');
const secret = config.JWT_SECRET;
const cookieSecret = config.COOKIE_SECRET;

fastify.register(require('@fastify/jwt'), {
  secret: secret
});

fastify.register(fastifyCors, {
    // Configura los orígenes permitidos
    origin: true
  });
  fastify.register(fastifyCookie, {
    secret: cookieSecret,
  });
  fastify.register(fastifyMultipart);
  fastify.register(login);
  fastify.register(user);
  fastify.register(formulario);
  fastify.register(post);
  fastify.register(agrupacion);
  fastify.register(actividad);
  fastify.register(publicacion);
  fastify.register(acreditaciones);
  fastify.register(imagenes);
  fastify.register(tag);
module.exports = fastify;