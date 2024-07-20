"use strict";

const publicacionService = require("../services/publicacion.service.js");
const { publicacionBodySchema} = require("../schema/publicacion.schema.js");

/**
 * Obtiene todas las publicaciones
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function getpublicaciones(req, res) {
    try {
        // Obtiene todas las publicaciones
        const publicaciones = await publicacionService.getpublicaciones();

        // Retorna las publicaciones
        res.status(200).json(publicaciones);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener las publicaciones:', error);
        res.status(500).send('Error al obtener las publicaciones');
    }
}

/**
 * Obtiene una publicacion por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function getpublicacionById(req, res) {
    try {
        // Obtiene el id de la publicacion
        const id = req.params.id;

        // Obtiene la publicacion por su id
        const publicacion = await publicacionService.getpublicacionById(id);

        // Retorna la publicacion
        res.status(200).json(publicacion);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener la publicacion:', error);
        res.status(500).send('Error al obtener la publicacion');
    }
}

/**
 * Crea una nueva publicacion
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function createpublicacion(req, res) {
    try {
        // Valida el cuerpo de la solicitud
        const { error, value } = publicacionBodySchema.validate(req.body);

        if (error) {
            return res.status(400).send(error.message);
        }

        // Crea una nueva publicacion
        const newpublicacion = await publicacionService.createpublicacion(value);

        // Retorna la nueva publicacion
        res.status(201).json(newpublicacion);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar la publicacion:', error);
        res.status(500).send('Error al insertar la publicacion');
    }
}

/**
 * Actualiza una publicacion
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function updatepublicacion(req, res) {
    try {
        // Obtiene el id de la publicacion
        const id = req.params.id;

        // Valida el cuerpo de la solicitud
        const { error, value } = publicacionBodySchema.validate(req.body);

        if (error) {
            return res.status(400).send(error.message);
        }

        // Actualiza la publicacion
        const updatedpublicacion = await publicacionService.updatepublicacion(id, value);

        // Retorna la publicacion actualizada
        res.status(200).json(updatedpublicacion);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar la publicacion:', error);
        res.status(500).send('Error al actualizar la publicacion');
    }
}

/**
 * Elimina una publicacion
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function deletepublicacion(req, res) {
    try {
        // Obtiene el id de la publicacion
        const id = req.params.id;

        // Elimina la publicacion
        await publicacionService.deletepublicacion(id);

        // Retorna un mensaje de éxito
        res.status(200).send('Publicacion eliminada');
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar la publicacion:', error);
        res.status(500).send('Error al eliminar la publicacion');
    }
}

module.exports = {
    getpublicaciones,
    getpublicacionById,
    createpublicacion,
    updatepublicacion,
    deletepublicacion
};