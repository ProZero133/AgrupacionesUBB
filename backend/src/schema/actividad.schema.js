const Joi = require("joi");

// Esquema de validación para el cuerpo de la solicitud de asignar
const actividadBodySchema = Joi.object({
    nom_act: Joi.string().required().messages({
      "string.empty": "El nombre de la actividad no puede estar vacío.",
      "any.required": "El nombre de la actividad es obligatorio.",
      "string.base": "El nombre de la actividad debe ser de tipo string.",
    }),
    descripcion: Joi.string().required().messages({
        "string.empty": "La descripción no puede estar vacía.",
        "any.required": "La descripción es obligatoria.",
        "string.base": "La descripción debe ser de tipo string.",
    }),
    imagen: Joi.number().integer().optional().messages({
        "number.base": "La imagen debe ser de tipo número.",
        "number.integer": "La imagen debe ser un entero.",
    }),
    tipo: Joi.bool().required().messages({
        "bool.empty": "El tipo de actividad no puede estar vacío.",
        "any.required": "El tipo de actividad es obligatorio.",
        "bool.base": "El tipo de actividad debe ser de tipo bool.",
    }),  
    id_agr: Joi.number().integer().required().messages({
        "number.base": "El id de la agrupación debe ser de tipo número.",
        "number.integer": "El id de la agrupación debe ser un entero.",
        "any.required": "El id de la agrupación es obligatorio.",
    }),
  });
  
  
  module.exports = { 
      actividadBodySchema,
      //actividadIdSchema,
  };