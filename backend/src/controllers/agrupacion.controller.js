"use strict";

const { getAgrupaciones, getAgrupacionById } = require("../services/agrupacion.service.js");
const { agrupacionBodySchema, agrupacionId } = require("../schema/agrupacion.schema.js");

async function ObtenerAgrupaciones(req, res) {
    try {
        // Obtiene todas las agrupaciones
        const agrupaciones = await getAgrupaciones();

        // Retorna las agrupaciones
        res.status(200).json(agrupaciones);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener las agrupaciones:', error);
        res.status(500).send('Error al obtener las agrupaciones');
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

async function createAgrupacion(req, res) {
    try {
        // Valida el cuerpo de la solicitud
        const { error, value } = agrupacionBodySchema.validate(req.body);

        if (error) {
            // Retorna un error si el cuerpo de la solicitud es inválido
            res.status(400).send(error.message);
            return;
        }

        // Crea una nueva agrupacion
        const agrupacion = await agrupacionService.createAgrupacion(req.body);

        // Retorna la nueva agrupacion
        res.status(201).json(agrupacion);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al crear la agrupacion:', error);
        res.status(500).send('Error al crear la agrupacion');
    }
}

async function updateAgrupacion(req, res) {
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
        const agrupacion = await agrupacionService.updateAgrupacion(id, req.body);

        // Retorna la agrupacion actualizada
        res.status(200).json(agrupacion);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar la agrupacion:', error);
        res.status(500).send('Error al actualizar la agrupacion');
    }
}

module.exports = {
    ObtenerAgrupaciones,
    ObtenerAgrupacionesPorID,
    createAgrupacion,
    updateAgrupacion
};