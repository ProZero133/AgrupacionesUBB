const {validarUsuario, asignarToken} = require('../services/auth.service');
async function EmailLogin(request) {
    const { email } = request.body; // Asume que el correo se envía en el cuerpo de la solicitud
    //LLamar a la base de datos para verificar si el usuario existe
    const result = await validarUsuario(email);
    const usuario = result.user[0];
    if (result.success) {
      console.log('Usuario encontrado, enviando correo de verificación...');
      console.log(`Rol: ${usuario.rol_u}`);
      asignarToken(usuario);
    } else {
      console.log('Usuario no encontrado, no se enviará correo de verificación');
    }

};
module.exports={EmailLogin}