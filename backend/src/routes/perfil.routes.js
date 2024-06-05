const perfilController = require('../controllers/perfil.controller');

async function routes(fastify, options) {
    fastify.get('/:UserId', perfilController.getProfile);
    fastify.put('/:UserId', perfilController.updateProfile);
}

module.exports = routes;

