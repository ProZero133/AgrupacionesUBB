

async function getActividades() {
    try {
        // Obtiene todas las actividades de la base de datos
        const actividades = await Actividad.findAll();

        // Retorna todas las actividades
        return actividades;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener las actividades:', error);
        throw error;
    }
}

async function getActividadById(id) {
    try {
        // Obtiene la actividad con el id especificado de la base de datos
        const actividad = await Actividad.findByPk(id);

        // Retorna la actividad
        return actividad;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener la actividad:', error);
        throw error;
    }
}

async function createActividad(actividadData) {
    try {
        // Inserta una nueva actividad en la base de datos
        const newActividad = await Actividad.create({
            nom_act: actividadData.nom_act,
            descripcion: actividadData.descripcion,
            imagen: actividadData.imagen,
            tipo: actividadData.tipo,
            id_agr: actividadData.id_agr
        });

        // Retorna la nueva actividad
        return newActividad;
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
    deleteActividad
};