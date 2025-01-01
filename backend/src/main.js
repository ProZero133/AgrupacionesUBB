const fastify = require('./config/configFastify.js');
const config = require('./config/configEnv.js');
const fastifyPort = config.FastifyPort;
const fastifyHost = config.FastifyHost;
const url = config.URL;
const secret = config.JWT_SECRET;

fastify.listen({
    port: fastifyPort,
    host: fastifyHost,
}, (err) => {
    if (err) {
        console.error('Error al iniciar el servidor:', err);
        process.exit(1);
    }
    console.log(`Servidor escuchando en el puerto ${fastifyPort}`);
});

module.exports = fastify;