
const { getActividades, getActividadesByAgrupacion, getActividadById, createActividad } = require('../services/actividad.service');
const { actividadBodySchema } = require('../schema/actividad.schema.js');

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

async function crearActividad(req, reply) {
    try {
        // Valida el cuerpo de la solicitud
        
        const { body } = req;
        const { error, value } = actividadBodySchema.validate(body);
        
        // No es necesario convertir la imagen de base64 a hexadecimal
        // Si la imagen está en base64 y es una cadena, se puede dejar tal cual
        if (body.imagen && typeof body.imagen === 'string') {
            console.log("Imagen recibida en base64");
        }
        
        if (error) {
            console.log("Error en la validación");
            console.log(error.details.map(detail => detail.message));
            // Si hay un error, retorna un error de validación
            reply.code(400).send(error.details.map(detail => detail.message));
            return;
        }
        console.log("Validacion exitosa, Creando actividad");

        // Crea una nueva actividad
        const actividad = await createActividad(body);

        // Retorna la nueva actividad
        reply.code(201).send(actividad);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar la actividad:', error);
        reply.code(500).send('Error al insertar la actividad');
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
    crearActividad,
    updateActividad,
    deleteActividad,
    ObtenerActividadesPorAgrupacion
};
