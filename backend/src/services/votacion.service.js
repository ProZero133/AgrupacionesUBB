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
        const newVotacion = await Votacion.create({
            id_pub: votacion.id_pub,
            descripcion: votacion.descripcion,
        });

        // Retorna la nueva publicacion
        return newVotacion;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar la votacion:', error);
        throw error;
    }
}

async function updateVotacion(id, votacionData) {
    try {
        // Actualiza la votacion con el id especificado en la base de datos
        const [rowsUpdated, [updatedvotacion]] = await Votacion.update({
            id_pub: votacionData.id_pub,
            descripcion: votacionData.descripcion,
        }, {
            where: { id: id },
            returning: true
        });

        // Retorna la votacion actualizada
        return updatedvotacion;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar la votacion:', error);
        throw error;
    }
}

async function deleteVotacion(id) {
    try {
        // Elimina la votacion con el id especificado de la base de datos
        const rowsDeleted = await Votacion.destroy({
            where: { id: id }
        });

        // Retorna la cantidad de filas eliminadas
        return rowsDeleted;
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