const { ObtenerUsuarios } = require('../controllers/admin.controller');
const { ObtenerAcreditaciones, AceptacionAcreditaciondeGrupo, RechazoAcreditaciondeGrupo } = require('../controllers/AcreditacionGrupo.controller');
const { ObtenerUsuariosdeAgrupacion, ObtenerRolUsuario, CambiarRoldeUsuario } = require('../controllers/agrupacion.controller');
const { AceptacionActividad } = require('../controllers/actividad.controller');
const { isUser, isAdmin, isUserOrAdmin } = require('../middlewares/auth.middleware.js');
module.exports = function(fastify, options, done) {
  fastify.decorate("authenticate", async (request, reply) => {
    try {
      const token = request.cookies.TokenAutorizacion;
      if (!token) {
        return reply.status(401).send({ error: 'No autorizado' });
      }
      const decoded = await fastify.jwt.verify(token);
      request.user = decoded; 
    } catch (err) {
      reply.status(401).send({ error: 'Token inválido' });
    }
  });
  
  fastify.get('/usuarios', { preHandler: [isAdmin] },ObtenerUsuarios);
  fastify.get('/acreditaciones', { preHandler: [isAdmin] },ObtenerAcreditaciones);
  fastify.put('/aceptacionAcr/:id_agr', { preHandler: [isAdmin] },AceptacionAcreditaciondeGrupo);
  fastify.put('/rechazoAcr/:id_agr', { preHandler: [isAdmin] },RechazoAcreditaciondeGrupo);
  fastify.get('/administracionderoles/:id_agr', { preHandler: [isUserOrAdmin] },ObtenerUsuariosdeAgrupacion); // Devuelve los usuarios que pertenecen a una agrupacion en especifico
  fastify.get('/obtencionderoles/:id_agr/:rut', { preHandler: [isAdmin] },ObtenerRolUsuario); // Devuelve los usuarios que pertenecen a una agrupacion en especifico
  fastify.put('/administracionderoles/:id_agr/:rut', { preHandler: [isUserOrAdmin] },CambiarRoldeUsuario); // Cambia el rol de un usuario en una agrupacion
  fastify.put('/aceptacionAct/:id_act', { preHandler: [isAdmin] },AceptacionActividad);

  done();
};