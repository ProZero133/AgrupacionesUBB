"use strict";

const { getAgrupaciones } = require("../services/agrupacion.service.js");

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

module.exports = {
    ObtenerAcreditaciones
};
