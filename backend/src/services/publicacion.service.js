const { pool } = require('../db.js');

async function getPublicacion() {
   try{
    // Obtiene todas las publicaciones
    const publicaciones = await pool.query('SELECT * FROM "Publicacion"');
    // Retorna las publicaciones
    return publicaciones.rows;
   }
    catch (error) {
      console.log('Error al obtener las publicaciones:', error);
    }
}

async function getPublicacionById(id) {
    try{
        // Obtiene la publicacion con el id especificado
        const publicacion = await pool.query('SELECT * FROM "Publicacion" WHERE id_pub = $1', [id]);
        // Retorna la publicacion
        return publicacion;
    }
    catch (error) {
        console.log('Error al obtener la publicacion:', error);
    }
}

async function createPublicacion(publicacionData) {
    try {
        // Inserta una nueva publicacion en la base de datos
        const newpublicacion = await pool.query('INSERT INTO "Publicacion" (encabezado, imagen, id_agr, rut, fecha_publicacion) VALUES ($1, $2, $3, $4, $5) RETURNING *', [publicacionData.encabezado, publicacionData.imagen, publicacionData.id_agr, publicacionData.rut, publicacionData.fecha_publicacion]);
        
        // Retorna la nueva publicacion
        return newpublicacion;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar la publicacion:', error);
        throw error;
    }
}

async function updatePublicacion(id, publicacionData) {
    try {
        // construye la consulta SQL para actualizar la publicacion
        const consulta = 'UPDATE "Publicacion" SET encabezado = $1, imagen = $2, id_agr = $3, RUT = $4, fecha_publicacion = $5 WHERE id = $6 RETURNING *';
        const valores = [publicacionData.encabezado, publicacionData.imaPub, publicacionData.id_agr, publicacionData.RUT, publicacionData.fecha_publicacion, id];
        
        // Ejecuta la consulta SQL y actualiza la publicacion
        const resultado = await pool.query(consulta, valores);
        
        // Chequea si la publicacion se encontró y se actualizó
        if (resultado.rows.length === 0) {
            throw new Error('Publicacion no se encontró o no se hicieron cambios.');
        }
        
        // Retorna la publicacion actualizada
        const updatedPublicacion = resultado.rows[0];
        return updatedPublicacion;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar la publicacion:', error);
        throw error;
    }
}

async function deletePublicacion(id) {
    try {
        // Construye la consulta SQL para eliminar la publicacion
        const consulta = 'DELETE FROM "Publicacion" WHERE id = $1 RETURNING *';
        const valor = [id];
        
        // Ejecuta la consulta SQL y elimina la publicacion
        const resultado = await pool.query(consulta, valor);
        
        // Retorna el numero de filas eliminadas
        const publicacionEliminada = resultado.rowCount;
        return publicacionEliminada;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar la publicacion:', error);
        throw error;
    }
}

module.exports = {
    getPublicacion,
    getPublicacionById,
    createPublicacion,
    updatePublicacion,
    deletePublicacion
};