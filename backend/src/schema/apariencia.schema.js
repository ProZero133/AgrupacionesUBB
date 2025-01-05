const Joi = require("joi");

// Esquema de validación para el cuerpo de la solicitud de agrupacion
const aparienciaSchema = Joi.object({
    BordeDescripcion: Joi.string().required().messages({
        'string.base': 'BordeDescripcion debe ser un texto.',
        'string.empty': 'BordeDescripcion no puede estar vacío.',
        'any.required': 'BordeDescripcion es un campo requerido.'
    }),
    FondoDescripcion: Joi.string().required().messages({
        'string.base': 'FondoDescripcion debe ser un texto.',
        'string.empty': 'FondoDescripcion no puede estar vacío.',
        'any.required': 'FondoDescripcion es un campo requerido.'
    }),
    SombraDescripcion: Joi.array().items(
        Joi.alternatives().try(Joi.number(), Joi.string())
    ).required().messages({
        'array.base': 'SombraDescripcion debe ser un arreglo.',
        'array.includes': 'SombraDescripcion debe contener números o textos.',
        'any.required': 'SombraDescripcion es un campo requerido.'
    }),
    BordeActividades: Joi.string().required().messages({
        'string.base': 'BordeActividades debe ser un texto.',
        'string.empty': 'BordeActividades no puede estar vacío.',
        'any.required': 'BordeActividades es un campo requerido.'
    }),
    FondoActividades: Joi.string().required().messages({
        'string.base': 'FondoActividades debe ser un texto.',
        'string.empty': 'FondoActividades no puede estar vacío.',
        'any.required': 'FondoActividades es un campo requerido.'
    }),
    SombraActividades: Joi.array().items(
        Joi.alternatives().try(Joi.number(), Joi.string())
    ).required().messages({
        'array.base': 'SombraActividades debe ser un arreglo.',
        'array.includes': 'SombraActividades debe contener números o textos.',
        'any.required': 'SombraActividades es un campo requerido.'
    })
}).strict();

    module.exports = {
        aparienciaSchema,
    };