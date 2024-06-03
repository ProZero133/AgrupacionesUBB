const Joi = require("joi");

// Esquema de validación para el cuerpo de la solicitud de publicacion
const publicacionBodySchema = Joi.object({
    encabezado: Joi.string().required().messages({
        "string.empty": "El título de la publicación no puede estar vacío.",
        "any.required": "El título de la publicación es obligatorio.",
        "string.base": "El título de la publicación debe ser de tipo string.",
        }),
    cuerpo: Joi.string().required().messages({
        "string.empty": "El contenido de la publicación no puede estar vacío.",
        "any.required": "El contenido de la publicación es obligatorio.",
        "string.base": "El contenido de la publicación debe ser de tipo string.",
        }),
    imaPub: Joi.bytea().messages({
        "string.base": "La imagen debe ser de tipo bytea.",
        }),
    id_agr: Joi.integer().required().messages({
        "string.empty": "El id de la agrupación no puede estar vacío.",
        "any.required": "El id de la agrupación es obligatorio.",
        "string.base": "El id de la agrupación debe ser de tipo integer.",
        }),
    RUT: Joi.string().required().messages({
        "string.empty": "El RUT no puede estar vacío.",
        "any.required": "El RUT es obligatorio.",
        "string.base": "El RUT debe ser de tipo string.",
        }),
    fecha_publicacion: Joi.date().required().messages({
        "string.empty": "La fecha de publicacion no puede estar vacía.",
        "any.required": "La fecha de publicacion es obligatoria.",
        "string.base": "La fecha de publicacion debe ser de tipo date.",
        }),
    });

module.exports = {
    publicacionBodySchema,
};