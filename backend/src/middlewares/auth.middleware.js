// auth.middleware.js
const config = require('../config/configEnv.js');
const secretKey = config.JWT_SECRET;
function verifyToken(request, reply, done) {
  const authHeader = request.headers['authorization'];
  if (!authHeader) {
    return reply.status(401).send({ success: false, message: 'No se encuentra el token' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return reply.status(401).send({ success: false, message: 'No se encuentra el token' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return reply.status(401).send({ success: false, message: 'Fallo al autenticar el token' });
    }
    request.user = decoded;
    done();
  });
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