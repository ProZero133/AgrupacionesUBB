
const { getActividades, getActividadesByAgrupacion, getActividadById } = require('../services/actividad.service');

async function ObtenerActividades(req, res) {
    const respuesta = await getActividades();
    if (respuesta.length === 0) {
        return res.send({ success: false, message: 'No se encontraron actividades' });
    }
    else{
        return res.send(respuesta);
    }
}

async function ObtenerActividadPorID(req, res) {
    const respuesta = await getActividadById(req.params.id);
    if (respuesta.length === 0) {
        return res.send({ success: false, message: 'No se encontraron actividades' });
    }
    else{
        return res.send(respuesta);
    }
}

async function ObtenerActividadesPorAgrupacion(req, res) {
    const respuesta = await getActividadesByAgrupacion(req.params.id_agr);
    if (respuesta.length === 0) {
        return res.send({ success: false, message: 'No se encontraron actividades' });
    }
    else{
        return res.send(respuesta);
    }
}

async function createActividad(req, res) {
    try {
        // Valida el cuerpo de la solicitud
        const { error, value } = actividadBodySchema.validate(req.body);

        if (error) {
            // Si hay un error, retorna un error de validación
            res.status(400).send(error.message);
            return;
        }

        // Crea una nueva actividad
        const actividad = await actividadService.createActividad(value);

        // Retorna la nueva actividad
        res.status(201).json(actividad);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar la actividad:', error);
        res.status(500).send('Error al insertar la actividad');
    }
}



async function updateActividad(req, res) {
    try {
        // Obtiene el id de la actividad
        const id = req.params.id;

        // Valida el cuerpo de la solicitud
        const { error, value } = actividadBodySchema.validate(req.body);

        if (error) {
            // Si hay un error, retorna un error de validación
            res.status(400).send(error.message);
            return;
        }

        // Actualiza la actividad
        const actividad = await actividadService.updateActividad(id, value);

        // Retorna la actividad actualizada
        res.status(200).json(actividad);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar la actividad:', error);
        res.status(500).send('Error al actualizar la actividad');
    }
}



async function deleteActividad(req, res) {
    try {
        // Obtiene el id de la actividad
        const id = req.params.id;

        // Elimina la actividad
        await actividadService.deleteActividad(id);

        // Retorna un mensaje de éxito
        res.status(200).send('Actividad eliminada');
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar la actividad:', error);
        res.status(500).send('Error al eliminar la actividad');
    }
}

module.exports = {
    ObtenerActividades,
    ObtenerActividadPorID,
    createActividad,
    updateActividad,
    deleteActividad,
    ObtenerActividadesPorAgrupacion
};
