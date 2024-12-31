const { obtenerUsuariosPlataforma, getCorreoSubstring } = require('../services/user.service');

async function ObtenerUsuarios(request, reply) {
    const resultUsuarios = await obtenerUsuariosPlataforma();
    if (resultUsuarios.length === 0) {
        return reply.send({ success: false, message: 'No se encontraron usuarios' });
    }
    else {
        return reply.send(resultUsuarios);
    }
}

async function correoSubString(request, reply) {
    const { correo } = request.params;
    const usuariosPlataforma = await obtenerUsuariosPlataforma();
    const resultadoSubString = await getCorreoSubstring(correo);

    // compara usuariosPlataforma con resultadoSubString
    let resultUsuarios = [];
    for (let i = 0; i < usuariosPlataforma.length; i++) {
        for (let j = 0; j < resultadoSubString.length; j++) {

            if (usuariosPlataforma[i].rut === resultadoSubString[j].rut.toString()) {
                
                console.log(resultadoSubString[j]);
                resultUsuarios.push(resultadoSubString[j]);
            }
        }
    }
    if (resultUsuarios.length === 0) {
        return reply.send({ success: false, message: 'No se encontraron usuarios' });
    }
    else {
        return reply.send(resultUsuarios);
    }
}



module.exports = { ObtenerUsuarios, correoSubString };