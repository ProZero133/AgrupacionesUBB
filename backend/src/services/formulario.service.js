const { pool } = require('../db.js');

async function getFormularios() {
   try{
    // Obtiene todos los formularios
    const formularios = await pool.query('SELECT * FROM "Formulario"');
    // Retorna los formularios
    return formularios.rows;
   }
    catch (error) {
      console.log('Error al obtener los formularios:', error);
    }
}

async function getFormularioById(id) {
    try{
        // Obtiene el formulario con el id especificado
        const formulario = await pool.query('SELECT * FROM "Formulario" WHERE id_pub = $1', [id]);
        // Retorna el formulario
        return formulario;
    }
    catch (error) {
        console.log('Error al obtener el formulario:', error);
    }
}

async function createFormulario(formularioData) {
    try {
        // Crea la consulta SQL para insertar un nuevo formulario
        const sql = 'INSERT INTO "Formulario" (id_pub, descripcion, hyperlink) VALUES ($1, $2, $3) RETURNING *';
        // Crea el formulario en la base de datos
        const newformulario = await pool.query(sql, [formularioData.id_pub, formularioData.descripcion, formularioData.hyperlink]);
        // Retorna el formulario creado
        return newformulario.rows[0];
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar el formulario:', error);
        throw error;
    }
}

async function updateFormulario(id, formularioData) {
    try {
        // Crea la consulta SQL para actualizar el formulario
        const sql = 'UPDATE "Formulario" SET id_pub = $1, descripcion = $2, hyperlink = $3 WHERE id = $4 RETURNING *';
        // Actualiza el formulario en la base de datos
        const updatedformulario = await pool.query(sql, [formularioData.id_pub, formularioData.descripcion, formularioData.hyperlink, id]);
        // Retorna el formulario actualizado
        return updatedformulario;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar el formulario:', error);
        throw error;
    }
}

async function deleteFormulario(id) {
    try {
        // Crea la consulta SQL para eliminar el formulario
        const sql = 'DELETE FROM "Formulario" WHERE id = $1';
        // Elimina el formulario de la base de datos
        await pool.query(sql, [id]);
        //Retorna mensaje de exito
        return 'Formulario eliminado correctamente';
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar el formulario:', error);
        throw error;
    }
}

module.exports = {
    getFormularios,
    getFormularioById,
    createFormulario,
    updateFormulario,
    deleteFormulario
};