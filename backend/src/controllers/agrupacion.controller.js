"use strict";

const { getAgrupaciones, getAgrupacionById, createAgrupacion, updateAgrupacion } = require("../services/agrupacion.service.js");
const { agrupacionBodySchema, agrupacionId } = require("../schema/agrupacion.schema.js");

async function VerGrupos(request, reply) {
    const agrupaciones = await getAgrupaciones();
    if (agrupaciones.length === 0) {
        return reply.send({ success: false, message: 'No se encontraron agrupaciones' });
    }
    else {

        return reply.send(agrupaciones);

    }
}

async function ObtenerAgrupacionesPorID(req, res) {
    try {
        // Obtiene el id de la agrupacion
        const id = req.params.id;

        // Obtiene la agrupacion por su id
        const agrupacion = await getAgrupacionById(id);

        // Retorna la agrupacion
        res.status(200).json(agrupacion);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener la agrupacion:', error);
        res.status(500).send('Error al obtener la agrupacion');
    }
}

async function crearAgrupacion(req, res) {
    try {
        // Valida el cuerpo de la solicitud
        const { error, value } = agrupacionBodySchema.validate(req.body);

        if (error) {
            // Retorna un error si el cuerpo de la solicitud es inválido
            res.code(400).send(error.details.map(detail => detail.message));
            return;
        }

        // Crea una nueva agrupacion
        const agrupacion = await createAgrupacion(req.body);

        // Retorna la nueva agrupacion
        res.code(201).send(agrupacion);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al crear la agrupacion:', error);
        res.status(500).send('Error al crear la agrupacion');
    }
}

async function editarAgrupacion(req, res) {
    try {
        // Obtiene el id de la agrupacion
        const id = req.params.id;

        // Valida el cuerpo de la solicitud
        const { error, value } = agrupacionBodySchema.validate(req.body);

        if (error) {
            // Retorna un error si el cuerpo de la solicitud es inválido
            res.status(400).send(error.message);
            return;
        }

        // Actualiza la agrupacion
        const agrupacion = await updateAgrupacion(id, req.body);

        // Retorna la agrupacion actualizada
        res.status(200).json(agrupacion);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar la agrupacion:', error);
        res.status(500).send('Error al actualizar la agrupacion');
    }
}

module.exports = {
    VerGrupos,
    ObtenerAgrupacionesPorID,
    crearAgrupacion,
    editarAgrupacion
};