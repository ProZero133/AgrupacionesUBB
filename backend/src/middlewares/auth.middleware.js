// auth.middleware.js
const config = require('../config/configEnv.js');
const secretKey = config.JWT_SECRET;



async function authenticate(request, reply) {
  try {
    const token = request;
    if (!token) {
      return reply.status(401).send({ error: 'No autorizado' });
    }
    const decoded = await request.jwtVerify();
    request.user = decoded; // Adjunta los datos del usuario al objeto request
  } catch (err) {
    reply.status(401).send({ error: 'Token inválido' });
  }
}

async function isAdmin(request, reply) {
  await authenticate(request, reply);
  if (request.user && request.user.rol !== 'Admin') {
    return reply.status(403).send({ error: 'Acceso denegado: rol no autorizado1' });
  }
}

async function isUser(request, reply) {
  await authenticate(request, reply);
  if (request.user && request.user.rol !== 'Estudiante') {
    return reply.status(403).send({ error: 'Acceso denegado: rol no autorizado2' });
  }
}
async function isUserOrAdmin(request, reply) {
  await authenticate(request, reply);
  if (request.user && request.user.rol !== 'Estudiante' && request.user.rol !== 'Admin') {
    return reply.status(403).send({ error: 'Acceso denegado: rol no autorizado3' });
  }
}
module.exports = { isAdmin, isUser, isUserOrAdmin, authenticate };