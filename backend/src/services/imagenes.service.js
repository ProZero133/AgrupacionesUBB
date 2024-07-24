const { pool } = require('../db.js');

async function getImagenes() {
    try{
        // Obtiene todas las actividades
        const imagenes = await pool.query('SELECT * FROM "Imagenes"');
        console.log(imagenes.rows);
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
        const imagenLength = imgData.imagen.length;
        const step = Math.floor(imagenLength / 3);
        
        // Calcular las posiciones de los caracteres. Ajustar por -1 porque los índices de cadena comienzan en 0.
        let pos1 = step - 1;
        let pos2 = (2 * step) - 1;
        let pos3 = imagenLength - 1; // Asegurar que el último carácter siempre sea seleccionado.
        
        // Concatenar caracteres en las posiciones calculadas.
        let codigoPre = imgData.imagen.charAt(pos1) + imgData.imagen.charAt(pos2) + imgData.imagen.charAt(pos3);

        let numericString = "";

        for (let i = 0; i < codigoPre.length; i++) {
            let asciiValue = codigoPre.charCodeAt(i); // Get ASCII value of the character
            numericString += asciiValue.toString(); // Concatenate ASCII value as string
        }

        let id_imagen = parseInt(numericString);

        console.log("id_imagen");
        console.log(numericString);

        const newImagen = await pool.query(
            'INSERT INTO "Imagenes"(id_imagen, imagen) VALUES($1, $2) RETURNING *',
            [id_imagen, imgData.imagen]
        );
        // Retorna la nueva imagen insertada
        let imagenInserted = newImagen.rows[0];
        imagenInserted.id_imagen = id_imagen;
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