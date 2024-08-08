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
async function getUsuarioServidor(rut){
    try{
        const result = await pool.query(`SELECT * FROM sm_usuario WHERE rut = $1;`, [rut]);
        return result.rows[0];
    }
    catch(error){
        console.error('Error en la consulta:', error);
        return { error: "Ocurrió un error al obtener el usuario por RUT." };
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
async function getUsuarioByRut(req){
    try{
        const rut = req;
        const result = await pool.query(`SELECT * FROM sm_usuario WHERE rut = $1;`, [rut]);
        return result.rows;
    }
    catch(error){
        console.error('Error en la consulta:', error);
        return { error: "Ocurrió un error al obtener el usuario por RUT." };
    }
}

async function getUsuarioByCorreo(req){
    try{
        const correo = req;
        const result = await pool.query(`SELECT * FROM sm_usuario WHERE correo = $1;`, [correo]);
        return result.rows;
    }
    catch(error){
        console.error('Error en la consulta:', error);
        return { error: "Ocurrió un error al obtener el usuario por correo." };
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

async function getTagsSimilares(tag){
    try{
        // Convertir el parámetro de búsqueda a minúsculas
        const lowerTag = tag.toLowerCase();
        const result = await pool.query(`SELECT * FROM "Tags" WHERE LOWER(nombre_tag) LIKE '%${lowerTag}%'`);
        return result.rows;
    }
    catch(error){
        console.error('Error en la consulta:', error);
        return error;
    }
}
async function getPreferenciasUsuario(rut){
    try{
        const result = await pool.query(`SELECT * FROM "Posee_3" WHERE rut = $1;`, [rut]);
        return result.rows;
    }
    catch(error){
        console.error('Error en la consulta:', error);
        return error;
    }
}
async function updatePreferenciasUsuario(rut, preferencias) {
    let allInsertsSuccessful = true; // Asumimos que todas las inserciones serán exitosas inicialmente

    for (let i = 0; i < preferencias.length; i++) {
        try {
            // Suponiendo que la tabla se llama 'preferencias_usuario' y tiene columnas 'rut' y 'preferencia'
            // Ajusta la consulta según tu esquema de base de datos
            const result = await pool.query(
                `INSERT INTO "Posee_3" (rut, id_tag) VALUES ($1, $2)`,
                [rut, preferencias[i]] // Asumiendo que preferencias[i] es un valor adecuado para insertar
            );
        } catch (error) {
            console.error('Error en la inserción:', error);
            allInsertsSuccessful = false; // Marca que al menos una inserción falló
            break; // Opcional: detener el proceso en el primer error
        }
    }

    return { success: allInsertsSuccessful };
}
async function getTagById(id){
    try{
        const result = await pool.query(`SELECT * FROM "Tags" WHERE id_tag = $1;`, [id]);
        return result.rows;
    }
    catch(error){
        console.error('Error en la consulta:', error);
        return error;
    }
}

async function deletePreferenciaUsuario(rut, id){
    try{
        const result = await pool.query(`DELETE FROM "Posee_3" WHERE rut = $1 AND id_tag = $2;`, [rut, id]);
        return result;
    }
    catch(error){
        console.error('Error en la consulta:', error);
        return error;
    }
}

module.exports = {
    obtenerUsuarios,
    registrarUsuario,
    obtenerUsuariosPlataforma,
    getUsuarioByRut,
    getUsuarioByCorreo,
    registrarUsuario,
    getTagsSimilares,
    getPreferenciasUsuario,
    updatePreferenciasUsuario,
    getTagById,
    getUsuarioServidor,
    deletePreferenciaUsuario
};
