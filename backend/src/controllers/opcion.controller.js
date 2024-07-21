"use strict";

const opcionService = require("../services/opcion.service");
const opcionBodySchema = require("../schema/opcion.schema");

/**
 * Obtiene todas las opciones
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function getOpciones(req, res) {
  try {
    const opciones = await opcionService.getOpciones();
    res.json(opciones);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

/**
 * Obtiene una opción por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function getOpcionById(req, res) {
    try {
        const id = req.params.id;
        const opcion = await opcionService.getOpcionById(id);
        res.json(opcion);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

/**
 * Crea una nueva opción
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function createOpcion(req, res) {
    try {
        const { error, value } = opcionBodySchema.validate(req.body);
        if (error) {
        return res.status(400).send(error.message);
        }
        const opcion = await opcionService.createOpcion(value);
        res.json(opcion);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

/**
 * Actualiza una opción por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function updateOpcion(req, res) {
    try {
        const id = req.params.id;
        const { error, value } = opcionBodySchema.validate(req.body);
        if (error) {
        return res.status(400).send(error.message);
        }
        const opcion = await opcionService.updateOpcion(id, value);
        res.json(opcion);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

/**
 * Elimina una opción por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function deleteOpcion(req, res) {
    try {
        const id = req.params.id;
        await opcionService.deleteOpcion(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
  getOpciones,
  getOpcionById,
  createOpcion,
  updateOpcion,
  deleteOpcion,
};