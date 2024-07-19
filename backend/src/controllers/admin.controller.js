const { ObtenUsuarios } = require('../services/user.service');

async function ObtenerUsuarios(request, reply) {
    try {
        console.log('Consultando nombres de tablas en la base de datos...');
        const result = await ObtenUsuarios();
        console.log('Consulta exitosa');
        console.log('Enviando nombres de tablas en la respuesta...: ', result.rows);
        reply
        .header('Content-Type', 'application/json')
        .send(result.rows);
    } catch (error) {
        console.error('Error en la consulta:', error);
        reply.status(500).send('Error interno del servidor');
    }
    }
module.exports = { ObtenerUsuarios };