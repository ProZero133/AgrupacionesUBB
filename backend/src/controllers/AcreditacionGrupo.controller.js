"use strict";

const { getAgrupaciones, updateAgrupacionVerificado, updateAgrupacionNoVerificado } = require("../services/agrupacion.service.js");

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

        // Actualiza la agrupacion con el id especificado, estableciendo "verificado" a "Verificado"
        await updateAgrupacionVerificado(id);
        
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

        // Actualiza la agrupacion con el id especificado, estableciendo "verificado" a "Rechazado"
        await updateAgrupacionNoVerificado(id);
        
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
