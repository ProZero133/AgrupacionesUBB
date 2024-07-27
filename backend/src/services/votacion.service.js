const { pool } = require('../db.js');
const { getPublicacionById } = require('./publicacion.service.js'); // Asegúrate de que la ruta sea correcta

async function getVotaciones() {
    try {
        // Obtiene todas las votaciones
        const votacionesResult = await pool.query('SELECT * FROM "Votacion"');
        const votaciones = votacionesResult.rows;

        // Procesar cada votación
        for (let i = 0; i < votaciones.length; i++) {
            const votacionId = votaciones[i].id_pub;
            try {
                // Obtener opciones para la votación actual
                const opcionesResult = await pool.query('SELECT * FROM "Opcion" WHERE id_votacion = $1', [votacionId]);
                const opciones = opcionesResult.rows;

                // Eliminar id_pub de cada opción
                for (let j = 0; j < opciones.length; j++) {
                    delete opciones[j].id_votacion;
                }

                // Adjuntar opciones a la votación
                votaciones[i].opciones = opciones;
            } catch (error) {
                console.log(`Error al obtener opciones para la votación con id ${votacionId}:`, error);
                votaciones[i].opciones = [];
            }
        }

        // Retorna las votaciones con sus opciones
        return votaciones;
    } catch (error) {
        console.log('Error al obtener las votaciones:', error);
        return [];
    }
}

async function getVotacionById(id) {
    try {
        // Obtiene la votacion con el id especificado
        const votacionResult = await pool.query('SELECT * FROM "Votacion" WHERE id_pub = $1', [id]);

        // Retorna null si no se encuentra la votacion
        if (votacionResult.rows.length === 0) {
            return null;
        }

        const votacion = votacionResult.rows[0];

        // Obtener opciones para la votacion
        const opcionesResult = await pool.query('SELECT * FROM "Opcion" WHERE id_votacion = $1', [id]);
        const opciones = opcionesResult.rows;

        // Eliminar id_pub de cada opción
        for (let i = 0; i < opciones.length; i++) {
            delete opciones[i].id_votacion;
        }

        // Adjuntar opciones a la votacion
        votacion.opciones = opciones;

        // Retorna la votacion con sus opciones
        return votacion;
    } catch (error) {
        console.log('Error al obtener la votacion:', error);
        return null;
    }
}

async function createVotacion(votacionData) {
    try {
        const publicacion = await getPublicacionById(votacionData.id_pub);
        
        if (!publicacion) {
            throw new Error('La publicación con el ID especificado no existe');
        }

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