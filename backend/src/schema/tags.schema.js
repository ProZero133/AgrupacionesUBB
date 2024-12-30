const Joi = require("joi");

// Esquema de validación para el cuerpo de la solicitud de tags
const tagsBodySchema = Joi.object({
    nombre_tag: Joi.string().required().messages({
        "string.empty": "El nombre del tag no puede estar vacío.",
        "any.required": "El nombre del tag es obligatorio.",
        "string.base": "El nombre del tag debe ser de tipo string.",
        }),
    rut: Joi.string().required().messages({
        "string.empty": "El RUT no puede estar vacío.",
        "any.required": "El RUT es obligatorio.",
        "string.base": "El RUT debe ser de tipo string.",
        }),
    });

module.exports = {
    tagsBodySchema,
    //tagsIdSchema,
};