const Joi = require("joi");

// Esquema de validación para el cuerpo de la solicitud de publicacion
const publicacionBodySchema = Joi.object({
    encabezado: Joi.string().required().messages({
        "string.empty": "El título de la publicación no puede estar vacío.",
        "any.required": "El título de la publicación es obligatorio.",
        "string.base": "El título de la publicación debe ser de tipo string.",
        }),
    imagen: Joi.number().integer().optional().messages({
        "number.base": "La imagen debe ser de tipo número.",
        "number.integer": "La imagen debe ser un entero.",
        }),
    id_agr: Joi.number().integer().required().messages({
        "number.base": "El id de la agrupación debe ser de tipo número.",
        "number.integer": "El id de la agrupación debe ser un entero.",
        "any.required": "El id de la agrupación es obligatorio.",
        }),
    rut: Joi.string().required().messages({
        "string.empty": "El RUT no puede estar vacío.",
        "any.required": "El RUT es obligatorio.",
        "string.base": "El RUT debe ser de tipo string.",
        }),
    fecha_publicacion: Joi.date().required().messages({
        "date.empty": "La fecha de publicacion no puede estar vacía.",
        "any.required": "La fecha de publicacion es obligatoria.",
        "date.base": "La fecha de publicacion debe ser de tipo date.",
        }),
    });

module.exports = {
    publicacionBodySchema,
    //publicacionIdSchema,
};