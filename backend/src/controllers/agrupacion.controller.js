"use strict";

const agrupacionService = require("../services/agrupacion.service.js");
const { agrupacionBodySchema, agrupacionId } = require("../schema/agrupacion.schema.js");

/**
 * Obtiene todas las agrupaciones
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function getAgrupaciones(req, res) {
    try {
        // Obtiene todas las agrupaciones
        const agrupaciones = await agrupacionService.getAgrupaciones();

        // Retorna las agrupaciones
        res.status(200).json(agrupaciones);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener las agrupaciones:', error);
        res.status(500).send('Error al obtener las agrupaciones');
    }
}

/**
 * Obtiene una agrupacion por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function getAgrupacionById(req, res) {
    try {
        // Obtiene el id de la agrupacion
        const id = req.params.id;

        // Obtiene la agrupacion por su id
        const agrupacion = await agrupacionService.getAgrupacionById(id);

        // Retorna la agrupacion
        res.status(200).json(agrupacion);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener la agrupacion:', error);
        res.status(500).send('Error al obtener la agrupacion');
    }
}

/**
 * Crea una nueva agrupacion
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

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

/**
 * Actualiza una agrupacion
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

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
    getAgrupaciones,
    getAgrupacionById,
    createAgrupacion,
    updateAgrupacion
};