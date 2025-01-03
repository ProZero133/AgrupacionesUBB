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

async function eliminarTagActividad(id) {
    try {
        const resAct = await pool.query('DELETE FROM "Actividad_tags" WHERE id_tag = $1;', [id]);

        if (resAct.rowCount > 0) {
            return { success: true, message: 'Tag eliminado correctamente' };
        } else {
            return { success: false, message: 'No existe un tag para eliminar' };
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return error;
    }
}

async function eliminarTagAgrupacion(id) {
    try {
        const resAgr = await pool.query('DELETE FROM "Agrupacion_tags" WHERE id_tag = $1;', [id]);

        if (resAgr.rowCount > 0) {
            return { success: true, message: 'Tag eliminado correctamente' };
        } else {
            return { success: false, message: 'No existe un tag para eliminar' };
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return error;
    }
}

async function eliminarTagPublicacion(id) {
    try {
        const resPub = await pool.query('DELETE FROM "Publicacion_tags" WHERE id_tag = $1;', [id]);
        
        if (resPub.rowCount > 0) {
            return { success: true, message: 'Tag eliminado correctamente' };
        } else {
            return { success: false, message: 'No existe un tag para eliminar' };
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return error;
    }
}

async function eliminarTagUsuario(id) {
    console.log("id_tag Usuario: ", id);
    try {
        const resUsr = await pool.query('DELETE FROM "Usuario_tags" WHERE id_tag = $1;', [id]);

        if (resUsr.rowCount > 0) {
            return { success: true, message: 'Tag eliminado correctamente' };
        } else {
            return { success: false, message: 'No existe un tag para eliminar' };
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        return error;
    }
}

async function eliminarTag(id) {
    try {
        const resTag = await pool.query('DELETE FROM "Tags" WHERE id_tag = $1;', [id]);

        if (resTag.rowCount > 0) {
            return { success: true, message: 'Tag eliminado correctamente' };
        } else {
            return { success: false, message: 'No existe un tag para eliminar' };
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
    obtenerAdministradorPorRut,
    eliminarTagActividad,
    eliminarTagAgrupacion,
    eliminarTagPublicacion,
    eliminarTagUsuario,
    eliminarTag,
};