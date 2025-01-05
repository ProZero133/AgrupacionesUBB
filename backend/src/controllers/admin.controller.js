const { obtenerUsuariosPlataforma, obtenerUsuarioPlataforma, getCorreoSubstring, getUsuarioByRut } = require('../services/user.service');
const { obtenerAdministradoresPlataforma, obtenerAdministradorPorRut, registrarAdministrador, eliminarAdministrador, eliminarTag, eliminarTagActividad, eliminarTagAgrupacion, eliminarTagPublicacion, eliminarTagUsuario, downgradearAgrupacion, restablecerVisibilidadAgrupacion } = require('../services/admin.service');
const { getAgrupacionById, getLiderArray } = require('../services/agrupacion.service');
const { notificarDowngrade } = require('../services/mail.service');
const { validarUsuarioRut } = require("../services/auth.service.js");
const bcrypt = require('bcrypt');

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
    const correo = request.body.correo;
    const usuariosPlataforma = await obtenerUsuariosPlataforma();
    const resultadoSubString = await getCorreoSubstring(correo);

    // compara usuariosPlataforma con resultadoSubString
    let resultUsuarios = [];
    for (let i = 0; i < usuariosPlataforma.length; i++) {
        for (let j = 0; j < resultadoSubString.length; j++) {

            if (usuariosPlataforma[i].rut === resultadoSubString[j].rut.toString()) {
                resultUsuarios.push(resultadoSubString[j]);
            }
        }
    }
    return reply.code(200).send(resultUsuarios);
}

async function Administradores(request, reply) {
    const decoded = await request.jwtVerify();
    const rol = decoded.rol;
    if (rol !== 'Admin') {
        reply.code(403).send({ error: 'Acceso denegado: rol no autorizado' });
        return;
    }
    const resultAdministradores = await obtenerAdministradoresPlataforma();
    if (resultAdministradores.length === 0) {
        return reply.send({ success: false, message: 'No se encontraron usuarios' });
    }
    const resultUsuarios = [];
    for (let i = 0; i < resultAdministradores.length; i++) {
        resultUsuarios.push(await getUsuarioByRut(resultAdministradores[i].rut));
    }

    return reply.code(200).send(resultUsuarios);
}

async function borrarAdministrador(request, reply) {
    const decoded = await request.jwtVerify();
    const rol = decoded.rol;
    const rutActual = decoded.rut;
    if (rol !== 'Admin') {
        reply.code(403).send({ success: false, message: 'Acceso denegado: rol no autorizado' });
        return;
    }
    const { rut, password } = request.body;
    if (!password) {
        reply.code(400).send({ success: false, message: 'La contraseña es requerida' });
        return;
    }
    if (!rut) {
        reply.code(400).send({ success: false, message: 'El rut es requerido' });
        return;
    }
    const admin = await obtenerAdministradoresPlataforma();
    let esAdmin = false;
    // Verificar si el rut se encuentra en la lista de administradores
    for (let i = 0; i < admin.length; i++) {
        if (admin[i].rut === rut) {
            esAdmin = true;
            break;
        }
    }
    if (!esAdmin) {
        reply.code(404).send({ success: false, message: 'El usuario no es administrador' });
        return;
    }
    const resultAdmin = await obtenerAdministradorPorRut(rutActual);
    const contrasenaValida = await bcrypt.compare(password, resultAdmin.contrasena);
    if (!contrasenaValida) {
        reply.code(401).send({ success: false, message: 'Contraseña incorrecta' });
        return;
    }
    const result = await eliminarAdministrador(rut);
    return reply.send(result);
}

async function crearAdministrador(request, reply) {
    try {
        const decoded = await request.jwtVerify();
        const rol = decoded.rol;
        const rutActual = decoded.rut;
        const contrasena = request.body.contrasena;
        const contrasenaConfirmacion = request.body.contrasenaAdmin;
        const resultAdmin = await obtenerAdministradorPorRut(rutActual);
        const contrasenaValida = await bcrypt.compare(contrasenaConfirmacion, resultAdmin.contrasena);
        if (!contrasenaValida) {
            reply.code(401).send({ success: false, message: 'Contraseña incorrecta' });
            return;
        }
        if (!contrasena) {
            reply.code(400).send({ success: false, message: 'La contraseña es requerida' });
            return;
        }
        if (rol !== 'Admin') {
            reply.code(403).send({ success: false, message: 'Acceso denegado: rol no autorizado' });
            return;
        }
        const rut = request.params.rut;
        const usuario = await obtenerUsuarioPlataforma(rut);
        if (usuario.length === 0) {
            reply.code(404).send({ success: false, message: 'Usuario no encontrado' });
            return;
        }
        if (usuario[0].rol === 'Admin') {
            reply.code(400).send({ success: false, message: 'El usuario ya es administrador' });
            return;
        }
        const contrasenaEncriptada = await bcrypt.hash(contrasena, 15);
        const result = await registrarAdministrador(rut, contrasenaEncriptada);
        return reply.send(result);
    }
    catch (error) {
        console.error('Error al crear administrador: ', error);
        reply.code(500).send('Error al crear administrador');
    }
}

async function EliminarTag(request, reply) {
    try {
        frontFormateado = parseInt(request.params.id, 10);

        const resAct = await eliminarTagActividad(frontFormateado);
        const resAgr = await eliminarTagAgrupacion(frontFormateado);
        const resPub = await eliminarTagPublicacion(frontFormateado);
        const resUsr = await eliminarTagUsuario(frontFormateado);

        const result = await eliminarTag(frontFormateado);
        return reply.send(result);
    } catch (error) {
        console.error('Error al eliminar tag:', error);
        reply.code(500).send('Error al eliminar tag');
    }
}

async function SancionarAgrupacion(request, reply) {
    try {
        const id_agr = request.params.id_agr;
        const motivo = request.body.motivo;
        const agrupacion = await getAgrupacionById(id_agr);
        const Lider = await getLiderArray(id_agr);
        const LiderAPI = await validarUsuarioRut(Lider[0].rut);
        const result = await downgradearAgrupacion(id_agr);


        const decoded = await request.jwtVerify();
        const rol = decoded.rol;
        const rutActual = decoded.rut;

        if (rol !== 'Admin') {
            reply.code(403).send({ success: false, message: 'Acceso denegado: rol no autorizado' });
            return;
        }

        const password = request.body.contraseñaAdmin;

        if (!password) {
            reply.code(400).send({ success: false, message: 'La contraseña es requerida' });
            return;
        }
        if (!rutActual) {
            reply.code(400).send({ success: false, message: 'El rut es requerido' });
            return;
        }
        const admin = await obtenerAdministradoresPlataforma();
        let esAdmin = false;
        // Verificar si el rut se encuentra en la lista de administradores
        for (let i = 0; i < admin.length; i++) {
            if (admin[i].rut === rutActual) {
                esAdmin = true;
                break;
            }
        }
        if (!esAdmin) {
            reply.code(404).send({ success: false, message: 'El usuario no es administrador' });
            return;
        }
        const resultAdmin = await obtenerAdministradorPorRut(rutActual);
        const contrasenaValida = await bcrypt.compare(password, resultAdmin.contrasena);
        if (!contrasenaValida) {
            reply.code(401).send({ success: false, message: 'Contraseña incorrecta' });
            return;
        }

        const mailDetails = {
            rut: LiderAPI.usuario.rut,
            nombre: LiderAPI.usuario.nombre,
            correo: LiderAPI.usuario.correo,
            nombre_agr: agrupacion.nombre_agr,
            motivo: motivo,
        };

        await notificarDowngrade(mailDetails);

        return reply.send(result);
    } catch (error) {
        console.error('Error al sancionar agrupación:', error);
        reply.code(500).send('Error al sancionar agrupación');
    }
}

async function cambiarVisibilidad(request, reply) {
    try {
        const id_agr = request.params.id_agr;
        const decoded = await request.jwtVerify();
        const rol = decoded.rol;
        const rutActual = decoded.rut;

        if (rol !== 'Admin') {
            reply.code(403).send({ success: false, message: 'Acceso denegado: rol no autorizado' });
            return;
        }

        const password = request.body.contraseñaAdmin;

        if (!password) {
            reply.code(400).send({ success: false, message: 'La contraseña es requerida' });
            return;
        }
        if (!rutActual) {
            reply.code(400).send({ success: false, message: 'El rut es requerido' });
            return;
        }
        const admin = await obtenerAdministradoresPlataforma();
        let esAdmin = false;
        // Verificar si el rut se encuentra en la lista de administradores
        for (let i = 0; i < admin.length; i++) {
            if (admin[i].rut === rutActual) {
                esAdmin = true;
                break;
            }
        }
        if (!esAdmin) {
            reply.code(404).send({ success: false, message: 'El usuario no es administrador' });
            return;
        }
        const resultAdmin = await obtenerAdministradorPorRut(rutActual);
        const contrasenaValida = await bcrypt.compare(password, resultAdmin.contrasena);
        if (!contrasenaValida) {
            reply.code(401).send({ success: false, message: 'Contraseña incorrecta' });
            return;
        }

        const result = await restablecerVisibilidadAgrupacion(id_agr);
        return reply.send(result);
    } catch (error) {
        console.error('Error al cambiar visibilidad:', error);
        reply.code(500).send('Error al cambiar visibilidad');
    }
}

module.exports = { ObtenerUsuarios, correoSubString, Administradores, borrarAdministrador, crearAdministrador, EliminarTag, SancionarAgrupacion, cambiarVisibilidad };