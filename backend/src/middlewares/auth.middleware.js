// auth.middleware.js
async function verifyToken(request, reply) {
  try {
    const token = request.cookies.authToken; // Asume que el token se almacena en una cookie llamada 'token'
    if (!token) {
      return reply.status(401).send({ success: false, message: 'Token no proporcionado' });
    }

    const decoded = this.jwt.verify(token);

    // Adjunta el usuario decodificado a la solicitud para su uso posterior
    request.user = decoded;
  } catch (error) {
    return reply.status(401).send({ success: false, message: 'Token inválido o no proporcionado' });
  }
}

async function IsAdmin(request, reply) {
  await verifyToken.call(this, request, reply);
  if (request.user && request.user.rol !== 'admin') {
    return reply.status(403).send({ success: false, message: 'Acceso denegado: rol no autorizado' });
  }
}

async function IsUser(request, reply) {
  await verifyToken.call(this, request, reply);
  if (request.user && request.user.rol !== 'usuario') {
    return reply.status(403).send({ success: false, message: 'Acceso denegado: rol no autorizado' });
  }
}

module.exports = { IsAdmin, IsUser };