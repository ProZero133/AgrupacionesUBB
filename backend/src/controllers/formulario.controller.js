"use strict";

const { getFormularios, getFormularioById, createFormulario, updateFormulario, deleteFormulario} = require("../services/formulario.service");
const { formularioBodySchema } = require("../schema/formulario.schema.js");

/**
 * Obtiene todas los formularios
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

const obtenerFormularios = async (req, res) => {
    try {
        const formularios = await formularioService.getFormularios();
        return res.code(200).send(formularios);
    } catch (error) {
        return res.code(500).send({ message: error.message });
    }
}

/**
 * Obtiene un formulario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

const obtenerFormularioPorId = async (req, res) => {
    try {
        const {id} = req.params;
        const formulario = await formularioService.getFormularioById(id);
        return res.code(200).send(formulario);
    } catch (error) {
        return res.code(500).send({ message: error.message });
    }
}


/**
 * Crea un nuevo formulario
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

const crearFormulario = async (req, res) => {
    try {
        const {body} = req;
        await formularioBodySchema.validateAsync(body);
        const formulario = await formularioService.createFormulario(body);
        return res.code(201).send(formulario);
    } catch (error) {
        return res.code(500).send({ message: error.message });
    }
}

/**
 * Actualiza un formulario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

const actualizarFormulario = async (req, res) => {
    try {
        const {id} = req.params;
        const {error} = await formularioBodySchema.validateAsync(req.body);
        if (error) {
            return res.code(400).send({ message: error.message });
        }
        const formulario = await formularioService.updateFormulario(id, req.body);
        return res.code(200).send(formulario);
    } catch (error) {
        return res.code(500).send({ message: error.message });
    }
}

/**
 * Elimina un formulario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

const eliminarFormulario = async (req, res) => {
    try {
        const {id} = req.params;
        await formularioService.deleteFormulario(id);
        return res.code(204).send();
    } catch (error) {
        return res.code(500).send({ message: error.message });
    }
}

module.exports = {
    obtenerFormularios,
    obtenerFormularioPorId,
    crearFormulario,
    actualizarFormulario,
    eliminarFormulario
};