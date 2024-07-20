"use strict";

const formularioService = require("../services/formulario.service");
const { formularioBodySchema } = require("../schema/formulario.schema.js");

/**
 * Obtiene todas los formularios
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

const getFormularios = async (req, res) => {
    try {
        const formularios = await formularioService.getFormularios();
        return res.status(200).json(formularios);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

/**
 * Obtiene un formulario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

const getFormularioById = async (req, res) => {
    try {
        const {id} = req.params;
        const formulario = await formularioService.getFormularioById(id);
        return res.status(200).json(formulario);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


/**
 * Crea un nuevo formulario
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

const createFormulario = async (req, res) => {
    try {
        const {body} = req;
        await formularioBodySchema.validateAsync(body);
        const formulario = await formularioService.createFormulario(body);
        return res.status(201).json(formulario);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

/**
 * Actualiza un formulario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

const updateFormulario = async (req, res) => {
    try {
        const {id} = req.params;
        const {error} = await formularioBodySchema.validateAsync(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        const formulario = await formularioService.updateFormulario(id, req.body);
        return res.status(200).json(formulario);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

/**
 * Elimina un formulario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

const deleteFormulario = async (req, res) => {
    try {
        const {id} = req.params;
        await formularioService.deleteFormulario(id);
        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getFormularios,
    getFormularioById,
    createFormulario,
    updateFormulario,
    deleteFormulario
};