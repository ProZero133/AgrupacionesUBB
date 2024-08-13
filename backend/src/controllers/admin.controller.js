const { getUsuarios } = require('../services/user.service');

async function ObtenerUsuarios(request, reply) {
    const resultUsuarios = await getUsuarios();
    if (resultUsuarios.length === 0) {
        return reply.send({ success: false, message: 'No se encontraron usuarios' });
    }
    else {
        return reply.send(resultUsuarios);
    }
}



module.exports = { ObtenerUsuarios };