const { pool } = require('../db.js');

async function getpublicaciones() {
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

async function getpublicacionById(id) {
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

async function createpublicacion(publicacionData) {
    try {
        // Inserta una nueva publicacion en la base de datos
        const newpublicacion = await Publicacion.create({
            encabezado: publicacion.encabezado,
            cuerpo: publicacion.cuerpo,
            imaPub: publicacion.imaPub,
            id_agr: publicacion.id_agr,
            RUT: publicacion.RUT,
            fecha_publicacion: publicacion.fecha_publicacion
        });

        // Retorna la nueva publicacion
        return newpublicacion;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar la publicacion:', error);
        throw error;
    }
}

async function updatepublicacion(id, publicacionData) {
    try {
        // Actualiza la publicacion con el id especificado en la base de datos
        const [rowsUpdated, [updatedpublicacion]] = await Publicacion.update({
            encabezado: publicacion.encabezado,
            cuerpo: publicacion.cuerpo,
            imaPub: publicacion.imaPub,
            id_agr: publicacion.id_agr,
            RUT: publicacion.RUT,
            fecha_publicacion: publicacion.fecha_publicacion
        }, {
            where: { id: id },
            returning: true
        });

        // Retorna la publicacion actualizada
        return updatedpublicacion;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar la publicacion:', error);
        throw error;
    }
}

async function deletepublicacion(id) {
    try {
        // Elimina la publicacion con el id especificado de la base de datos
        const rowsDeleted = await Publicacion.destroy({
            where: { id: id }
        });

        // Retorna la cantidad de filas eliminadas
        return rowsDeleted;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar la publicacion:', error);
        throw error;
    }
}

module.exports = {
    getpublicaciones,
    getpublicacionById,
    createpublicacion,
    updatepublicacion,
    deletepublicacion
};