const Joi = require('joi');

const formularioBodySchema = Joi.object({
    id_pub: Joi.number().integer().required().messages({
        "number.base": "El id de la publicación debe ser de tipo número.",
        "number.integer": "El id de la publicación debe ser un entero.",
        "any.required": "El id de la publicación es obligatorio.",
        }),
    descripcion: Joi.string().required().messages({
        "string.base": "La descripción debe ser de tipo texto.",
        "any.required": "La descripción es obligatoria.",
        }),
    hipervinculo: Joi.string().uri().required().messages({
        "string.base": "El hipervinculo debe ser de tipo texto.",
        "string.uri": "El hipervinculo debe ser una URL válida.",
        "any.required": "El hipervinculo es obligatorio.",
        }),
    });

    module.exports = {
        formularioBodySchema
    };