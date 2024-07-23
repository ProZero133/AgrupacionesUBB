"use strict";

const {getOpciones, getOpcionById, createOpcion, updateOpcion, deleteOpcion} = require("../services/opcion.service");
const opcionBodySchema = require("../schema/opcion.schema");

/**
 * Obtiene todas las opciones
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function obtenerOpciones(req, res) {
  try {
    const opciones = await opcionService.getOpciones();
    res.send(opciones);
  } catch (error) {
    res.code(500).send(error.message);
  }
}

/**
 * Obtiene una opción por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function obtenerOpcionPorId(req, res) {
    try {
        const id = req.params.id;
        const opcion = await opcionService.getOpcionById(id);
        res.send(opcion);
    } catch (error) {
        res.code(500).send(error.message);
    }
}

/**
 * Crea una nueva opción
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function crearOpcion(req, res) {
    try {
        const { error, value } = opcionBodySchema.validate(req.body);
        if (error) {
        return res.code(400).send(error.message);
        }
        const opcion = await opcionService.createOpcion(value);
        res.send(opcion);
    } catch (error) {
        res.code(500).send(error.message);
    }
}

/**
 * Actualiza una opción por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function actualizarOpcion(req, res) {
    try {
        const id = req.params.id;
        const { error, value } = opcionBodySchema.validate(req.body);
        if (error) {
        return res.code(400).send(error.message);
        }
        const opcion = await opcionService.updateOpcion(id, value);
        res.send(opcion);
    } catch (error) {
        res.code(500).send(error.message);
    }
}

/**
 * Elimina una opción por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function eliminarOpcion(req, res) {
    try {
        const id = req.params.id;
        await opcionService.deleteOpcion(id);
        res.send({ success: true });
    } catch (error) {
        res.code(500).send(error.message);
    }
}

module.exports = {
    obtenerOpciones,
    obtenerOpcionPorId,
    crearOpcion,
    actualizarOpcion,
    eliminarOpcion
};