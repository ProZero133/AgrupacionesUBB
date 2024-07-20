const { pool } = require('../db.js');

async function getActividades() {
    try{
        // Obtiene todas las actividades
        const actividades = await pool.query('SELECT * FROM "Actividad"');
        console.log(actividades.rows);
        // Retorna las actividades
        return actividades.rows;
    }
    catch (error) {
        console.log('Error al obtener las actividades:', error);
    }
}

async function getActividadById(id) {
    try {
        // Obtiene la actividad con el id especificado de la base de datos
        const actividad = await pool.query('SELECT * FROM "Actividad" WHERE id_act = $1', [id]);

        // Retorna la actividad
        return actividad;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener la actividad:', error);
        throw error;
    }
}

async function getActividadesByAgrupacion(id_agr) {
    try{
        // Obtiene todas las actividades de una agrupacion
        const actividades = await pool.query('SELECT * FROM "Actividad" WHERE id_agr = $1', [id_agr]);
        // Retorna las actividades
        return actividades.rows;
    }
    catch (error) {
        console.log('Error al obtener las actividades:', error);
    }
}

async function createActividad(actividadData) {
    try {
        // Inserta una nueva actividad en la base de datos usando PostgreSQL en una sola línea
        const newActividad = await pool.query(
            'INSERT INTO "Actividad"(nom_act, descripcion, imagen, tipo, id_agr) VALUES($1, $2, $3, $4, $5) RETURNING *',
            [actividadData.nom_act, actividadData.descripcion, actividadData.imagen, actividadData.tipo, actividadData.id_agr]
        );

        // Retorna la nueva actividad insertada
        return newActividad.rows[0];
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar la actividad:', error);
        throw error;
    }
}

async function updateActividad(id, actividadData) {
    try {
        // Actualiza la actividad con el id especificado en la base de datos
        const [rowsUpdated, [updatedActividad]] = await Actividad.update({
            nom_act: actividadData.nom_act,
            descripcion: actividadData.descripcion,
            imagen: actividadData.imagen,
            tipo: actividadData.tipo,
            id_agr: actividadData.id_agr
        }, {
            where: { id: id },
            returning: true
        });

        // Retorna la actividad actualizada
        return updatedActividad;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar la actividad:', error);
        throw error;
    }
}

async function deleteActividad(id) {
    try {
        // Elimina la actividad con el id especificado de la base de datos
        const rowsDeleted = await Actividad.destroy({
            where: { id: id }
        });

        // Retorna la cantidad de actividades eliminadas
        return rowsDeleted;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar la actividad:', error);
        throw error;
    }
}

// Exporta las funciones auxiliares de la actividad
module.exports = {
    getActividades,
    getActividadById,
    createActividad,
    updateActividad,
    deleteActividad,
    getActividadesByAgrupacion
};