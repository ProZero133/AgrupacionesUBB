const Joi = require("joi");

// Esquema de validación para el cuerpo de la solicitud de asignar
const actividadBodySchema = Joi.object({
    nomAct: Joi.string().required().messages({
      "string.empty": "El nombre de la actividad no puede estar vacío.",
      "any.required": "El nombre de la actividad es obligatorio.",
      "string.base": "El nombre de la actividad debe ser de tipo string.",
    }),
    descAct: Joi.string().required().messages({
        "string.empty": "La descripción no puede estar vacía.",
        "any.required": "La descripción es obligatoria.",
        "string.base": "La descripción debe ser de tipo string.",
    }),
    imaAct: Joi.bytea().messages({
        "string.base": "La imagen debe ser de tipo bytea.",
    }),
    tipoAct: Joi.bool().required().messages({
        "string.empty": "El tipo de actividad no puede estar vacío.",
        "any.required": "El tipo de actividad es obligatorio.",
        "string.base": "El tipo de actividad debe ser de tipo bool.",
    }),  
    id_agr: Joi.integer().required().messages({
        "string.empty": "El id de la agrupación no puede estar vacío.",
        "any.required": "El id de la agrupación es obligatorio.",
        "string.base": "El id de la agrupación debe ser de tipo integer.",
    }),
  });
  
  
  module.exports = { 
      actividadBodySchema,
      actividadIdSchema,
  };