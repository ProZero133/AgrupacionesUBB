const fastify = require('./config/configFastify.js');
const config = require('./config/configEnv.js');
const port = config.PORT;
const url = config.URL;

// Enrutador de la aplicación
// const publicacionRoutes = require('./routes/publicacion.routes.js');
// const agrupacionRoutes = require('./routes/agrupacion.routes.js');
// const actividadRoutes = require('./routes/actividad.routes.js');
// const userRoutes = require('./routes/user.routes.js');





  fastify.get('/api/auth/status', async (request, reply) => {
    // Aquí puedes implementar la lógica para verificar el estado de la autenticación
    // Por ejemplo, verificar si hay un token y si es válido
    const token = request.headers['authorization']?.split(' ')[1]; // Asume que el token viene en el encabezado de autorización
  
    if (!token) {
      return reply.status(401).send({ success: false, message: 'No se proporcionó token de autenticación' });
    }
  
    try {
      const decoded = await fastify.jwt.verify(token);
      // Si el token es válido, puedes devolver información relevante del usuario o simplemente un mensaje de éxito
      return reply.send({ success: true, message: 'Autenticación verificada', user: decoded });
    } catch (error) {
      return reply.status(401).send({ success: false, message: 'Token inválido o expirado', error: error.message });
    }
  });


  fastify.get('/validarToken', async (request, reply) => {
    const { token } = request.query;
    try {
      const decoded = fastify.jwt.verify(token);
      console.log('Token decodificado:', decoded);
      // Extrae el rol del usuario del objeto
      const rol = decoded.rol; // Asegúrate de usar 'rol_u' para coincidir con tu estructura de datos
  
      // Establece una cookie de primera parte
      reply.setCookie('authToken', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict', // Considera 'lax' si necesitas que la cookie sea enviada en solicitudes de terceros (dependiendo del contexto)
        secure: true, // Establece en false si estás desarrollando en localhost sin HTTPS
        maxAge: 3600 // Expire después de 1 hora, ajusta según sea necesario
      });
  
      // Redirige al usuario basado en su rol
      if (rol === 'Estudiante') {
        reply.redirect(`${url}/api/home`);
      } else if (rol === 'Admin') {
        reply.redirect(`${url}/api/adminhome`);
      } else {
        // Maneja el caso de roles no reconocidos
        reply.send({ success: false, message: 'Rol no reconocido' });
      }
    } catch (error) {
      reply.send({ success: false, message: 'Token inválido o expirado', error: error.message });
    }
  });

fastify.listen({
    port: 3000,
    host: '0.0.0.0',
}, (err) => {
    if (err) {
        console.error('Error al iniciar el servidor:', err);
        process.exit(1);
    }
    console.log(`Servidor escuchando en el puerto ${port}`);
});

module.exports = fastify;