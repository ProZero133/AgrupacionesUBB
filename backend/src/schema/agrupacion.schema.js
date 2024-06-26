const Joi = require("joi");

// Esquema de validación para el cuerpo de la solicitud de agrupacion
const agrupacionBodySchema = Joi.object({
    nomAgr: Joi.string().required().messages({
        "string.empty": "El nombre de la agrupación no puede estar vacío.",
        "any.required": "El nombre de la agrupación es obligatorio.",
        "string.base": "El nombre de la agrupación debe ser de tipo string.",
        }),
    descAgr: Joi.string().required().messages({
        "string.empty": "La descripción no puede estar vacía.",
        "any.required": "La descripción es obligatoria.",
        "string.base": "La descripción debe ser de tipo string.",
        }),
    verificado: Joi.bool().required().messages({
        "bool.empty": "El estado de verificación no puede estar vacío.",
        "any.required": "El estado de verificación es obligatorio.",
        "bool.base": "El estado de verificación debe ser de tipo bool.",
        }),
    fechaVerificacion: Joi.date().required().messages({
        "date.empty": "La fecha de verificación no puede estar vacía.",
        "any.required": "La fecha de verificación es obligatoria.",
        "date.base": "La fecha de verificación debe ser de tipo date.",
        }),
    RUT: Joi.string().required().messages({
        "string.empty": "El RUT no puede estar vacío.",
        "any.required": "El RUT es obligatorio.",
        "string.base": "El RUT debe ser de tipo string.",
        }),
    fechaCreacion: Joi.date().required().messages({
        "date.empty": "La fecha de creación no puede estar vacía.",
        "any.required": "La fecha de creación es obligatoria.",
        "date.base": "La fecha de creación debe ser de tipo date.",
        }),
    });

    module.exports = {
        agrupacionBodySchema,
        //agrupacionIdSchema,
    };