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
        const formularios = await getFormularios();
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
        const formulario = await getFormularioById(id);
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

async function crearFormulario(req, res) {
    try {
        const { error, value } = formularioBodySchema.validate(req.body);
        if (error) {
        console.error('Error al validar el formulario:', error);
        res.status(400).send('Error al validar el formulario');
        }
        const formulario = await createFormulario(req.body);
        res.send(formulario);
    } catch (error) {
        console.error('Error al crear el formulario:', error);
        res.status(500).send('Error al crear el formulario');
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
        const {error} = await formularioBodySchema.validate(req.body);
        if (error) {
            return res.code(400).send({ message: error.message });
        }
        const formulario = await updateFormulario(id, req.body);
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
        await deleteFormulario(id);
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