const { pool } = require('../db.js');

async function getVotaciones() {
   try{
    // Obtiene todas las votaciones
    const votaciones = await pool.query('SELECT * FROM "Votacion"');
    // Retorna las votaciones
    return posts.rows;
   }
    catch (error) {
      console.log('Error al obtener las votaciones:', error);
    }
}

async function getVotacionById(id) {
    try{
        // Obtiene la votacion con el id especificado
        const votacion = await pool.query('SELECT * FROM "Votacion" WHERE id_pub = $1', [id]);
        // Retorna la votacion
        return votacion;
    }
    catch (error) {
        console.log('Error al obtener la votacion:', error);
    }
}

async function createVotacion(votacionData) {
    try {
        // Inserta una nueva votacion en la base de datos
        const newVotacion = await pool.query('INSERT INTO "Votacion" (id_pub, descripcion) VALUES ($1, $2) RETURNING *', [votacionData.id_pub, votacionData.descripcion]);

        // Retorna la votacion recién creada
        return newVotacion;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar la votacion:', error);
        throw error;
    }
}

async function updateVotacion(id, votacionData) {
    try {
        //Arma la consulta SQL para actualizar la votacion
        const query = 'UPDATE "Votacion" SET id_pub = $1, descripcion = $2 WHERE id = $3 RETURNING *';
        // Actualiza la votacion con el id especificado en la base de datos
        const updatedVotacion = await pool.query(query, [votacionData.id_pub, votacionData.descripcion, id]);
        // Retorna la votacion actualizada
        return updatedVotacion;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar la votacion:', error);
        throw error;
    }
}

async function deleteVotacion(id) {
    try {
        // Elimina la votacion con el id especificado
        const deletedVotacion = await pool.query('DELETE FROM "Votacion" WHERE id = $1 RETURNING *', [id]);
        // Retorna la votacion eliminada
        return deletedVotacion;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar la votacion:', error);
        throw error;
    }
}

module.exports = {
    getVotaciones,
    getVotacionById,
    createVotacion,
    updateVotacion,
    deleteVotacion
};