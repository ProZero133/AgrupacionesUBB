"use strict";

const { getAgrupaciones, updateAgrupacionVerificado, updateAgrupacionNoVerificado } = require("../services/agrupacion.service.js");
const { getAgrupacionById } = require("../services/agrupacion.service.js");
const { getUsuarioByRut, obtenerUsuariosPlataforma } = require("../services/user.service.js");
const { notifyRechazo } = require("../services/mail.service.js");
const { getLider } = require("../services/agrupacion.service.js");

async function ObtenerAcreditaciones(req, reply) {
    try {
        // Obtiene todas las agrupaciones
        const agrupacionesCompletas = await getAgrupaciones();

        // Obtiene todos los usuarios
        const usuarios = await obtenerUsuariosPlataforma();

        // Obtiene al lider del grupo
        const lider = usuarios.map(usuario => {
            if (usuario.rol === 'Lider') {
                return usuario;
            }
        });

        // combina las agrupaciones con los usuarios
        const Agrupaciones_y_Usuarios = agrupacionesCompletas.map(Agrupacion => {
            const usuario = usuarios.find(usuario => usuario.rut === Agrupacion.rut);
            return { ...Agrupacion, ...usuario };
        });

        // Obtiene todas las acreditaciones en donde el atributo "verificado" sea igual "Pendiente"
        const agrupacionesPendientes = Agrupaciones_y_Usuarios.filter(Agrupacion => Agrupacion.verificado === 'Pendiente');

        reply.code(200).send(agrupacionesPendientes);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener las agrupaciones con estado "Pendiente":', error);
        reply.code(500).send('Error al obtener las agrupaciones con estado "Pendiente"');
    }
}


async function AceptacionAcreditaciondeGrupo(req, reply) {
    try {
        // se obtiene el id de la agrupacion
        const id = req.params.id_agr;
        const verificado = req.body.verificado;

        //Primero, se busca la agrupacion con el id especificado, para obtener su rut
        const agrupa = await getAgrupacionById(id);
        const Lider = await getLider(agrupa.id_agr);
        const usuario = await getUsuarioByRut(Lider.rut);

        const notificacion = {
            nombre: usuario.nombre,
            correo: usuario.correo,
            agrupacion: agrupa.nombre_agr,
            verificado: verificado
        };

        //Se notifica al usuario que su acreditación fue rechazada
        const notifica = await notifyRechazo(notificacion);

        try {
            const notificado = await updateAgrupacionVerificado(id);
        } catch (error) {
            console.error(`No se pudo verificar la agrupacion.`, error);
        }

        // Actualiza la agrupacion con el id especificado, estableciendo "verificado" a "Verificado"


        reply.code(200).send('Acreditación exitosa');
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al Acreditar: ', error);
        reply.code(500).send('Error al Acreditar: ');
    }
}

async function RechazoAcreditaciondeGrupo(req, reply) {
    try {
        // se obtiene el id de la agrupacion
        const id = req.params.id_agr;
        const verificado = req.body.verificado;
        const motivo = req.body.motivo;

        //Primero, se busca la agrupacion con el id especificado, para obtener su rut
        const agrupa = await getAgrupacionById(id);
        const Lider = await getLider(agrupa.id_agr);
        const usuario = await getUsuarioByRut(Lider.rut);

        const notificacion = {
            nombre: usuario.nombre,
            correo: usuario.correo,
            agrupacion: agrupa.nombre_agr,
            motivo: motivo,
            verificado: verificado
        };

        //Se notifica al usuario que su acreditación fue rechazada
        const notifica = await notifyRechazo(notificacion);

        try {
            const notificado = await updateAgrupacionNoVerificado(id);
        } catch (error) {
            console.error(`No se pudo no verificar la agrupacion.`, error);
        }

        reply.code(200).send('Rechazo exitoso');
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al Rechazar: ', error);
        reply.code(500).send('Error al Rechazar: ');
    }
}



module.exports = {
    ObtenerAcreditaciones,
    AceptacionAcreditaciondeGrupo,
    RechazoAcreditaciondeGrupo
};
