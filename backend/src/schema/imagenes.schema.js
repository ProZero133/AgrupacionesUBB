const Joi = require('joi');

const imagenesBodySchema = Joi.object({
    imagen: Joi.string().required().messages({
        "string.base": "La imagen debe ser de tipo texto.",
        "any.required": "La imagen es obligatoria.",
        }),
    });

    module.exports = { 
        imagenesBodySchema,
    };