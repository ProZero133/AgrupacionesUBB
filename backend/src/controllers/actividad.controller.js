"use strict";

const actividadService = require("../services/actividad.service.js");
const { actividadBodySchema, actividadId } = require("../schema/actividad.schema.js");

/**
 * Obtiene todas las actividades
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function getActividades(req, res) {
    try {
        // Obtiene todas las actividades
        const actividades = await actividadService.getActividades();

        // Retorna las actividades
        res.status(200).json(actividades);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener las actividades:', error);
        res.status(500).send('Error al obtener las actividades');
    }
}

/**
 * Obtiene una actividad por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function getActividadById(req, res) {
    try {
        // Obtiene el id de la actividad
        const id = req.params.id;

        // Obtiene la actividad por su id
        const actividad = await actividadService.getActividadById(id);

        // Retorna la actividad
        res.status(200).json(actividad);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener la actividad:', error);
        res.status(500).send('Error al obtener la actividad');
    }
}

/**
 * Crea una nueva actividad
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function createActividad(req, res) {
    try {
        // Valida el cuerpo de la solicitud
        const { error, value } = actividadBodySchema.validate(req.body);

        if (error) {
            // Si hay un error, retorna un error de validación
            res.status(400).send(error.message);
            return;
        }

        // Crea una nueva actividad
        const actividad = await actividadService.createActividad(value);

        // Retorna la nueva actividad
        res.status(201).json(actividad);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar la actividad:', error);
        res.status(500).send('Error al insertar la actividad');
    }
}

/**
 * Actualiza una actividad
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function updateActividad(req, res) {
    try {
        // Obtiene el id de la actividad
        const id = req.params.id;

        // Valida el cuerpo de la solicitud
        const { error, value } = actividadBodySchema.validate(req.body);

        if (error) {
            // Si hay un error, retorna un error de validación
            res.status(400).send(error.message);
            return;
        }

        // Actualiza la actividad
        const actividad = await actividadService.updateActividad(id, value);

        // Retorna la actividad actualizada
        res.status(200).json(actividad);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar la actividad:', error);
        res.status(500).send('Error al actualizar la actividad');
    }
}

/**
 * Elimina una actividad
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function deleteActividad(req, res) {
    try {
        // Obtiene el id de la actividad
        const id = req.params.id;

        // Elimina la actividad
        await actividadService.deleteActividad(id);

        // Retorna un mensaje de éxito
        res.status(200).send('Actividad eliminada');
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar la actividad:', error);
        res.status(500).send('Error al eliminar la actividad');
    }
}

module.exports = {
    getActividades,
    getActividadById,
    createActividad,
    updateActividad,
    deleteActividad
};
