"use strict";

const { getAgrupaciones, updateAgrupacionVerificado, updateAgrupacionNoVerificado } = require("../services/agrupacion.service.js");
const { getAgrupacionById } = require("../services/agrupacion.service.js");
const { getUsuarioByRut } = require("../services/user.service.js");
const { notifyRechazo } = require("../services/mail.service.js");

async function ObtenerAcreditaciones(req, reply) {
    try {
        // Obtiene todas las agrupaciones
        const agrupacionesCompletas = await getAgrupaciones();

        // Obtiene todas las acreditaciones en donde el atributo "verificado" sea igual "Pendiente"
        const agrupacionesPendientes = agrupacionesCompletas.filter(Agrupacion => Agrupacion.verificado === 'Pendiente');
        

        // Descomentar una de estas para debuggear
        // Muestra las agrupaciones completas
            //console.log(agrupacionesCompletas);
        // Muestra las arupaciones pendientes
            //console.log(agrupacionesPendientes);

        // Retorna las acreditaciones
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
        console.log("agrupa", agrupa);
        const usuario = await getUsuarioByRut(agrupa.rut);
        console.log("usuario", usuario);

        const notificacion = {
            correo: usuario[0].correo,
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
        console.log("agrupa", agrupa);
        const usuario = await getUsuarioByRut(agrupa.rut);
        console.log("usuario", usuario);

        const notificacion = {
            correo: usuario[0].correo,
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
