const { ObtenUsuarios } = require('../services/user.service');

async function ObtenerUsuarios(request, reply) {
    try {
        const result = await ObtenUsuarios();
        reply
        .header('Content-Type', 'application/json')
        .send(result.rows);
    } catch (error) {
        console.error('Error en la consulta:', error);
        reply.status(500).send('Error interno del servidor');
    }
    }
module.exports = { ObtenerUsuarios };