const Joi = require("joi");

// Esquema de validación para el cuerpo de la solicitud de agrupacion
const redesSchema = Joi.object({
    fb: Joi.string().messages({
        "string.empty": "El nombre de la red social no puede estar vacío.",
        "string.base": "El nombre de la red social debe ser un string.",
        }),
    ig: Joi.string().messages({
        "string.empty": "La red social no puede estar vacía.",
        "string.base": "El nombre de la red social debe ser un string.",
        }),
    tw: Joi.string().messages({
        "string.empty": "La red social no puede estar vacía.",
        "string.base": "El nombre de la red social debe ser un string.",
        }),
    }).strict();

    module.exports = {
        redesSchema,
    };