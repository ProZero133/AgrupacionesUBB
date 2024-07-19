const {pool} = require('../db.js');


// Obtiene todos los usuarios del servidor de la universidad
async function obtenerUsuarios() {
    try {
        const result = await pool.query(`
            SELECT * FROM sm_usuario;
        `);
        return result.rows;
    } catch (error) {
        console.error('Error en la consulta:', error);
        return error;
    }
}

// Obtiene todos los usuarios registrados en la plataforma
async function obtenerUsuariosPlataforma(){
    try {
        const result = await pool.query(`SELECT * FROM usuario;`);
        return result.rows;
    } catch (error) {
        console.error('Error en la consulta:', error);
        return error;
    }
}

// Busca un usuario en especifico en la plataforma segun su rut
async function obtenerUsuarioPlataforma(rut){
    try{
        const result = await pool.query(`SELECT * FROM usuario WHERE rut = $1;`, [rut]);
        return result.rows;
    }
    catch(error){
        console.error('Error en la consulta:', error);
        return error;
    }
}

// Registra un usuario en la plataforma
async function registrarUsuario(rut, rol){
    try {
        //Consultar si el usuario ya existe en la plataforma
        const usuario = await obtenerUsuarioPlataforma(rut);
        if(usuario.length > 0){
            return {success: false, message: 'Usuario ya existe en la plataforma'};
        }
        //Registrar usuario en la plataforma
        const result = await pool.query(`
            INSERT INTO usuario (rut, rol) VALUES ($1, $2);`, [rut, rol]);
        if(result.rowCount > 0){
            return {success: true, message: 'Usuario registrado correctamente'};
        }
        return {success: false, message: 'No se pudo registrar el usuario'};
        
    } catch (error) {
        console.error('Error en la consulta:', error);
        return error;
    }
}

module.exports = { obtenerUsuarios, registrarUsuario, obtenerUsuariosPlataforma, obtenerUsuarioPlataforma, registrarUsuario };