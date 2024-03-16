const fastify = require('fastify')();

fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

fastify.listen(3000, (err) => {
  if (err) throw err;
  console.log('Servidor escuchando en el puerto 3000');
});