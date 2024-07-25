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

async function getFechasActividades(id_agr) {
    try{
        const fechasActividades = await pool.query('SELECT fecha_actividad FROM "Programa" WHERE id_agr = $1', [id_agr]);
        return fechasActividades.rows;
    }
    catch (error) {
        console.log('Error al obtener las fechas de las actividades:', error);
    }
}

async function getFechaActividad(id_act) {
    try{
        const fechaActividad = await pool.query('SELECT fecha_actividad FROM "Programa" WHERE id_act = $1', [id_act]);
        return fechaActividad.rows[0];
    }
    catch (error) {
        console.log('Error al obtener la fecha de la actividad:', error);
    }
}

async function getParticipantesActividad(id_act) {
    try{
        const participantes = await pool.query('SELECT * FROM "Participa" WHERE id_act = $1', [id_act]);
        return participantes.rows;
    }
    catch (error) {
        console.log('Error al obtener los participantes de la actividad:', error);
    }
}

async function setParticipanteActividad(id_act, rut) {
    try{
        const response = await pool.query('INSERT INTO "Participa" (rut, id_act) VALUES ($1, $2) RETURNING *', [rut, id_act]);
        return response.rows[0];
    }
    catch (error) {
        console.log('Error al agregar un participante a la actividad:', error);
    }
}

async function setProgramacionActividad(id_agr, id_act, fecha_actividad) {
    try{
        const response = await pool.query('INSERT INTO "Programa" (id_agr, id_act, fecha_actividad) VALUES ($1, $2, $3) RETURNING *', [id_agr, id_act, fecha_actividad]);
        return response.rows[0];
    }
    catch (error) {
        console.log('Error al programar una actividad:', error);
    }
}

async function createActividad(actividadData) {
    try {
        const newActividad = await pool.query(
            'INSERT INTO "Actividad"(nom_act, descripcion, imagen, tipo, id_agr, cupos) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            [actividadData.nom_act, actividadData.descripcion, actividadData.imagen, actividadData.tipo, actividadData.id_agr, actividadData.cupos]
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
        //Validar que la actividad no tenga mas de un participante
        const participantes = await getParticipantesActividad(id);
        if(participantes.length > 1){
            return 'No es posible eliminar una actividad con mas de un participante';
        }
        //Validar que la actividad aun no ocurra
        const fechasActividades = await getFechaActividad(id);
        const fechaActual = new Date();
        if(fechaActual > fechasActividades.fecha_actividad){
            return 'No es posible eliminar una actividad que ya ocurrio';
        }


        // Elimina la actividad con el id especificado de la base de datos
        const response = await pool.query('DELETE FROM "Actividad" WHERE id_act = $1', [id]);
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
    getActividadesByAgrupacion,
    getFechasActividades,
    getParticipantesActividad,
    setParticipanteActividad,
    setProgramacionActividad,
    getFechaActividad
};