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
        // Inserta una nuevo formulario en la base de datos
        const newFormulario = await Formulario.create({
            id_pub: formulario.id_pub,
            descripcion: formulario.descripcion,
            hyperlink: formulario.hyperlink,
        });

        // Retorna el nuevo formulario
        return newFormulario;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar el formulario:', error);
        throw error;
    }
}

async function updateFormulario(id, formularioData) {
    try {
        // Actualiza el formulario con el id especificado en la base de datos
        const [rowsUpdated, [updatedformulario]] = await Formulario.update({
            id_pub: formularioData.id_pub,
            descripcion: formularioData.descripcion,
            hyperlink: formularioData.hyperlink,
        }, {
            where: { id: id },
            returning: true
        });

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
        // Elimina el formulario con el id especificado de la base de datos
        const rowsDeleted = await Formulario.destroy({
            where: { id: id }
        });

        // Retorna la cantidad de filas eliminadas
        return rowsDeleted;
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