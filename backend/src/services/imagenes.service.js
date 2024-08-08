const { pool } = require('../db.js');

async function getImagenes() {
    try{
        // Obtiene todas las actividades
        const imagenes = await pool.query('SELECT * FROM "Imagenes"');
        // Retorna las actividades
        return imagenes.rows;
    }
    catch (error) {
        console.log('Error al obtener las imagenes:', error);
    }
}

async function getImagenbyId(id) {
    try {
        // Obtiene la actividad con el id especificado de la base de datos
        const imagen = await pool.query('SELECT * FROM "Imagenes" WHERE id_imagen = $1', [id]);
        const imageData = imagen.rows[0].imagen;
        return imageData;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener la imagen:', error);
        throw error;
    }
}

async function createImagen(imgData) {
    try {
        // Crea una nueva imagen
        const newImagen = await pool.query(
            'INSERT INTO "Imagenes"(imagen) VALUES($1) RETURNING *',
            [imgData.imagen]
        );
        // Retorna la nueva imagen insertada
        const imagenInserted = newImagen.rows[0];
        return imagenInserted;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar la imagen:', error);
        throw error;
    }
}

async function deleteImagen(id_imagen) {
    try {
        // Elimina la actividad con el id especificado de la base de datos
        const rowsDeleted = await Imagenes.destroy({
            where: { id_imagen: id_imagen }
        });

        // Retorna la cantidad de actividades eliminadas
        return rowsDeleted;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar la imagen:', error);
        throw error;
    }
}

// Exporta las funciones auxiliares de la imagen
module.exports = {
    getImagenes,
    getImagenbyId,
    createImagen,
    deleteImagen
};