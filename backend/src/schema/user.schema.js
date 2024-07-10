const Joi = require('joi');

const userSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "El email no puede estar vacío.",
        "any.required": "El email es obligatorio.",
        "string.base": "El email debe ser de tipo string.",
        "string.email": "El email debe tener un formato válido.",
      }),

});

function validateEmail(email) {
    const validDomains = ["@alumnos.ubiobio.cl", "@ubiobio.cl"];
    const domain = email.split("@")[1];
    if (!validDomains.includes("@" + domain)) {
        throw new Error("El email debe tener un dominio válido.");
    }
    return userSchema.validate(email);
}

module.exports = {
    userSchema,
    //userIdSchema
}