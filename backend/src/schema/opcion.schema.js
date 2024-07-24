const Joi = require('joi');

const opcionBodySchema = Joi.object({
    nombre: Joi.string().required().messages({
        "string.base": "La descripción debe ser de tipo texto.",
        "any.required": "La descripción es obligatoria.",
        }),
    resultado: Joi.number().integer().required().messages({
        "number.base": "El resultado debe ser de tipo número.",
        "number.integer": "El resultado debe ser de tipo entero.",
        "any.required": "El resultado es obligatorio.",
        }),
    id_votacion: Joi.number().integer().required().messages({
        "number.base": "El id_votacion debe ser de tipo número.",
        "number.integer": "El id_votacion debe ser de tipo entero.",
        "any.required": "El id_votacion es obligatorio.",
        }),    
});

module.exports = opcionBodySchema;