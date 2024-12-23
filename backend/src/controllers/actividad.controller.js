
const {
    getActividades,
    getActyAgr,
    getActividadesByAgrupacion,
    getActividadById,
    createActividad,
    setProgramacionActividad,
    setParticipanteActividad,
    deleteActividad,
    getActividadesByGrupoUsuario,
    getParticipantesActividad,
    getActividadesParticipante,
    deleteParticipanteActividad,
    setAprobacionActividad,
    deletePrograma,
    deleteActividadPublica,
    getActividadesPublicas
} = require('../services/actividad.service');
const { actividadBodySchema } = require('../schema/actividad.schema.js');
const { getLider } = require('../services/agrupacion.service.js');

async function ObtenerActividades(req, res) {
    const respuesta = await getActividades();
    if (respuesta.length === 0) {
        return res.send({ success: false, message: 'No se encontraron actividades' });
    }
    else {
        return res.send(respuesta);
    }
}

async function ObtenerActividadyAgrupacion(req, res) {
    const actividades = await getActyAgr();

    if (actividades.length === 0) {
        return res.send({ success: false, message: 'No se encontraron actividades' });
    }
    else {
        return res.send(actividades);
    }
}

async function ObtenerActividadPorID(req, res) {
    const respuesta = await getActividadById(req.params.id);
    if (respuesta.length === 0) {
        return res.send({ success: false, message: 'No se encontraron actividades' });
    }
    else {
        return res.send(respuesta);
    }
}


async function ObtenerActividadesPorAgrupacion(req, res) {
    try {
        const respuesta = await getActividadesByAgrupacion(req.params.id);
        if (respuesta.length === 0) {
            return res.send({ success: false, message: 'No se encontraron actividades en la' + req.params.id });
        } else {
            return res.send(respuesta);
        }
    } catch (error) {
        console.error("Error al obtener actividades: ", error);
        return res.status(500).send({ success: false, message: 'Error al obtener actividades' });
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
        }

        if (error) {
            // Si hay un error, retorna un error de validación
            reply.code(400).send(error.details.map(detail => detail.message));
            return;
        }

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
        // UPDATE ACTIVIDAD SOLAMENTE CAMBIARA LA TABLA PROGRAMA YA Q SOLO CAMBIARA LA FECHA DE LA ACTIVIDAD

        // Retorna la actividad actualizada
        res.status(200).json(actividad);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar la actividad:', error);
        res.status(500).send('Error al actualizar la actividad');
    }
}

async function ObtenerCreadorActividad(req, res) {
    try {
        const id_act = req.params.id_act;
        const creador = await getParticipantesActividad(id_act);

        if (creador.length === 0) {
            return res.send({ success: false, message: 'No se encontro el creador de la actividad' });
        }
        return res.send(creador);

    } catch (error) {
        console.error('Error al obtener el creador de la actividad:', error);
        return res.status(500).send({ success: false, message: 'Error al obtener el creador de la actividad' });
    }
}


async function eliminarActividad(req, res) {
    try {
        // Obtiene el id de la actividad
        const id_act = req.params.id_act;
        const rut = req.params.rut;
        const actividad = await getActividadById(id_act);
        if (actividad.length === 0) {
            return res.send({ success: false, message: 'No se encontro la actividad' });
        }
        const lider = await getLider(actividad.rows[0].id_agr);
        if (rut !== lider.rut) {
            return res.send({ success: false, message: 'No eres el lider de la agrupacion' });
        }
        // Elimina la actividad
        await deleteActividad(id_act);
        // Retorna un mensaje de éxito
        res.status(200).send('Actividad eliminada');
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar la actividad:', error);
        res.status(500).send('Error al eliminar la actividad');
    }
}


async function eliminarActividadPublica(req, res) {
    try {
        // Obtiene el id de la actividad
        const id_act = req.params.id_act;
        const rut = req.params.rut;

        const actividad = await getActividadById(id_act);

        if (actividad.length === 0) {
            return res.send({ success: false, message: 'No se encontro la actividad' });
        }

        // Elimina participa
        await deleteParticipanteActividad(id_act, rut);
        // Elimina programa
        await deletePrograma(id_act);
        // Elimina la actividad
        await deleteActividadPublica(id_act);

        // Retorna un mensaje de éxito
        res.status(200).send('Actividad eliminada');
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar la actividad:', error);
        res.status(500).send('Error al eliminar la actividad');
    }
}

async function rechazarActividad(req, res) {
    try {
        // Obtiene el id de la actividad
        const id_act = req.params.id_act;
        await deleteActividad(id_act);

        res.status(200).send('Actividad eliminada');

    } catch (error) {
        console.error('Error al eliminar la actividad:', error);
        res.status(500).send('Error al eliminar la actividad');
    }
}


async function programarActividad(req, res) {
    try {
        // Obtiene el id de la actividad
        const id_act = req.params.id_act;
        const id_agr = req.params.id_agr;
        const fecha_actividad = req.body.fecha_actividad;
        // Programa la actividad
        const actividad = await setProgramacionActividad(id_agr, id_act, fecha_actividad);
        const lider = await getLider(id_agr);
        const rut = lider.rut;
        await setParticipanteActividad(id_act, rut);

        // Retorna la actividad programada
        res.code(200).send(actividad);

    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al programar la actividad:', error);
        res.code(500).send('Error al programar la actividad');
    }
}
async function participarActividad(req, res) {
    try {
        // Obtiene el id de la actividad
        const id_act = req.params.id_act;
        const rut = req.params.rut;

        // Programa la actividad
        await setParticipanteActividad(id_act, rut);

        // operacion exitosa
        res.code(200).send({ success: true, message: 'Participacion exitosa' });
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al programar la actividad:', error);
        res.code(500).send({ success: false, message: 'Error al programar la actividad' });
    }
}
async function ObtenerActividadesPorGrupoUsuario(req, res) {
    //Obtiene las actividades de los grupos a los que pertenece el usuario
    try {
        const { rut } = req.params;
        const actividades = await getActividadesByGrupoUsuario(rut);
        if (actividades.length === 0) {
            return res.send({ success: false, message: 'No se encontraron actividades' });
        }
        return res.send(actividades);
    } catch (error) {
        console.error('Error al obtener las actividades de los grupos del usuario:', error);
        return res.status(500).send({ success: false, message: 'Error al obtener las actividades de los grupos del usuario' });
    }
}

async function obtenerActividadesParticipante(req, res) {
    try {
        const { rut } = req.params;
        const actividades = await getActividadesParticipante(rut);
        if (actividades.length === 0) {
            return res.send({ success: false, message: 'No se encontraron actividades' });
        }
        return res.send(actividades);
    } catch (error) {
        console.error('Error al obtener las actividades del usuario:', error);
        return res.status(500).send({ success: false, message: 'Error al obtener las actividades del usuario' });
    }
}

async function abandonarActividad(req, res) {
    try {
        // Obtiene el id de la actividad
        const id_act = req.params.id_act;
        const rut = req.params.rut;
        // Programa la actividad
        const actividad = await deleteParticipanteActividad(id_act, rut);

        // Retorna la actividad programada
        res.code(200).send(actividad);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al programar la actividad:', error);
        res.code(500).send('Error al programar la actividad');
    }
}

async function AceptacionActividad(req, res) {
    try {
        // Obtiene el id de la actividad
        const id_act = req.params.id_act;
        // Programa la actividad
        const actividad = await setAprobacionActividad(id_act);
        // Retorna la actividad programada
        res.code(200).send(actividad);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al programar la actividad:', error);
        res.code(500).send('Error al programar la actividad');
    }
}

async function ObtenerActividadesPublicas(req, res) {
    try {
        const actividades = await getActividadesPublicas();
        if (actividades.length === 0) {
            return res.send({ success: false, message: 'No se encontraron actividades' });
        }
        return res.send(actividades);
    } catch (error) {
        console.error('Error al obtener las actividades publicas:', error);
        return res.status(500).send({ success: false, message: 'Error al obtener las actividades publicas' });
    }
}


module.exports = {
    ObtenerActividades,
    ObtenerActividadyAgrupacion,
    ObtenerActividadPorID,
    crearActividad,
    updateActividad,
    ObtenerCreadorActividad,
    eliminarActividad,
    rechazarActividad,
    ObtenerActividadesPorAgrupacion,
    programarActividad,
    participarActividad,
    ObtenerActividadesPorGrupoUsuario,
    obtenerActividadesParticipante,
    abandonarActividad,
    AceptacionActividad,
    eliminarActividadPublica,
    ObtenerActividadesPublicas
};
