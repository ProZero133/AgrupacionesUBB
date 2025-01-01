const { pool } = require('../db.js');
const { obtenerUsuarioPlataforma } = require('../services/user.service.js');




async function obtenerAdministradoresPlataforma() {
    try {
        const result = await pool.query(`SELECT * FROM usuario WHERE rol = 'Admin';`);
        return result.rows;
    } catch (error) {
        console.error('Error en la consulta:', error);
        return error;
    }
}

async function obtenerAdministradorPorRut(rut) {
    try {
        const result = await pool.query('SELECT * FROM administrador WHERE rut = $1;', [rut]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en la consulta de administrador:', error);
        throw new Error('Error al consultar el administrador');
    }
}

async function eliminarAdministrador(rut) {
    try {
        const cantidadAdministradores = await obtenerAdministradoresPlataforma();
        if (cantidadAdministradores.length === 1) {
            return { success: false, message: 'Debe existir por lo menos un administrador' };
        }
        //Consultar si el usuario ya existe en la plataforma
        const usuario = await obtenerUsuarioPlataforma(rut);
        if (usuario.length > 0) {
            // Actualizar rol
            const result = await pool.query(`UPDATE usuario SET rol = 'Estudiante' WHERE rut = $1;`, [rut]);
            // Eliminar de la tabla administrador
            const resultAdmin = await pool.query(`DELETE FROM administrador WHERE rut = $1;`, [rut]);
            if (result.rowCount > 0 && resultAdmin.rowCount > 0) {
                return { success: true, message: 'Usuario actualizado correctamente' };
            }
        }
        return { success: false, message: 'No se pudo actualizar el usuario' };

    } catch (error) {
        console.error('Error en la consulta:', error);
        return error;
    }
}

async function registrarAdministrador(rut, constrasena) {
    try {
        //Consultar si el usuario ya existe en la plataforma
        const result = await pool.query(`UPDATE usuario SET rol = 'Admin' WHERE rut = $1;`, [rut]);
        const resultAdmin = await pool.query(`INSERT INTO administrador (rut, contrasena) VALUES ($1, $2);`, [rut, constrasena]);
    
        if (result.rowCount === 1 && resultAdmin.rowCount === 1) {
            return { success: true, message: 'Administrador registrado exitosamente' };
        } else {
            return { success: false, message: 'No se pudo registrar al administrador' };
        }


    } catch (error) {
        console.error('Error en la consulta:', error);
        return error;
    }
}


module.exports = {
    obtenerAdministradoresPlataforma,
    eliminarAdministrador,
    registrarAdministrador,
    obtenerAdministradorPorRut

};