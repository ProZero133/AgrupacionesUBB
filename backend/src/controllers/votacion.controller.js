"use strict";

const {getVotaciones, getVotacionById, createVotacion, updateVotacion, deleteVotacion} = require("../services/votacion.service");
const {votacionBodySchema} = require("../schema/votacion.schema.js");

/**
 * Obtiene todas las votaciones
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

const obtenerVotaciones = async (req, res) => {
    try {
        const votaciones = await votacionService.getVotaciones();
        res.status(200).json(votaciones);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

/**
 * Obtiene una votación por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

const obtenerVotacionPorId = async (req, res) => {
    try {
        const {id} = req.params;
        const votacion = await votacionService.getVotacionById(id);
        res.status(200).json(votacion);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

/**
 * Crea una votación
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

const crearVotacion = async (req, res) => {
    try {
        const {body} = req;
        await votacionBodySchema.validateAsync(body);
        const votacion = await votacionService.createVotacion(body);
        res.status(201).json(votacion);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

/**
 * Actualiza una votación
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

const actualizarVotacion = async (req, res) => {
    try {
        // Obtiene el id de la votacion
        const { id } = req.params;

        // Valida el cuerpo de la petición
        const { error } = votacionBodySchema.validate(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // Actualiza la votacion por su id
        const post = await votacionService.updateVotacion(id, req.body);

        // Retorna la votacion actualizada
        res.status(200).json(post);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar la votacion:', error);
        res.status(500).send('Error al actualizar la votacion');
    }
}

/**
 * Elimina una votación
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

const eliminarVotacion = async (req, res) => {
    try {
        // Obtiene el id de la votacion
        const { id } = req.params;

        // Elimina la votacion por su id
        await votacionService.deleteVotacion(id);

        // Retorna un mensaje de éxito
        res.status(200).send('Votacion eliminada');
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar la votacion:', error);
        res.status(500).send('Error al eliminar la votacion');
    }
}

module.exports = {
    obtenerVotaciones,
    obtenerVotacionPorId,
    crearVotacion,
    actualizarVotacion,
    eliminarVotacion
};