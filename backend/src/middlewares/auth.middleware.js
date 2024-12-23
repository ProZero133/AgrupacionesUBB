// auth.middleware.js
const config = require('../config/configEnv.js');
const secretKey = config.JWT_SECRET;
const fastify = require('../main.js');



fastify.decorate("authenticate", async (request, reply) => {
  try {
    const token = request.cookies.token;
    if (!token) {
      return reply.status(401).send({ error: 'No autorizado' });
    }
    const decoded = await fastify.jwt.verify(token);
    request.user = decoded; // Adjunta los datos del usuario al objeto request
  } catch (err) {
    reply.status(401).send({ error: 'Token inválido' });
  }
});

fastify.decorate("authorize", (roles) => {
  return async (request, reply) => {
    if (!roles.includes(request.user.role)) {
      return reply.status(403).send({ error: 'Acceso denegado' });
    }
  };
});

module.exports = { IsAdmin, IsUser };