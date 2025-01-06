const Joi = require("joi");

// Esquema de validación para el cuerpo de la solicitud de agrupacion
const redesSchema = Joi.object({
    fb: Joi.string().allow('').optional().messages({
        "string.base": "El nombre de la red social debe ser un string.",
        "string.empty": "El nombre de la red social no puede estar vacío.",
    }),
    ig: Joi.string().allow('').optional().messages({
        "string.base": "El nombre de la red social debe ser un string.",
        "string.empty": "La red social no puede estar vacía.",
    }),
    tw: Joi.string().allow('').optional().messages({
        "string.base": "El nombre de la red social debe ser un string.",
        "string.empty": "La red social no puede estar vacía.",
    }),
    }).strict();

    module.exports = {
        redesSchema,
    };