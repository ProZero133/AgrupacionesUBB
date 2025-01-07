
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
    getActividadesParticipanteUsuario,
    deleteParticipanteActividad,
    setAprobacionActividad,
    deletePrograma,
    deleteActividadPublica,
    getActividadesPublicas,
    insertTagsActividad,
    getTagsActividad,
    getFechasActividades,
    getActividadesSinProgramacion,
    updateCuposActividad
} = require('../services/actividad.service');
const { actividadBodySchema } = require('../schema/actividad.schema.js');
const { getLider, getLiderArray, getRolUsuario, getAgrupacionById, getUsuariosdeAgrupacion } = require('../services/agrupacion.service.js');
const { obtenerUsuarioPlataforma } = require('../services/user.service.js');
const { obtenerTagPorId } = require('../controllers/tags.controller.js');
const { notifyAprobarActPublica, notifyRechazarActPublica } = require("../services/mail.service.js");
const { validarUsuarioRut } = require("../services/auth.service.js");

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
            return res.code(404).send({ success: false, message: 'No se encontraron actividades en la agrupacion ' + req.params.id , data: req.params.id });
        } else {
            return res.code(200).send(respuesta);
        }
    } catch (error) {
        console.error("Error al obtener actividades: ", error);
        return res.status(500).send({ success: false, message: 'Error al obtener actividades' });
    }
}

async function obtenerTimestamp() {
    const ahora = new Date();
    const opcionesFecha = { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' };
    const opcionesHora = { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formatoFecha = new Intl.DateTimeFormat('en-CA', opcionesFecha).format(ahora);
    const partesHora = new Intl.DateTimeFormat('en-GB', opcionesHora).formatToParts(ahora);
    const hora = partesHora.find((p) => p.type === 'hour').value;
    const minutos = partesHora.find((p) => p.type === 'minute').value;
    const segundos = partesHora.find((p) => p.type === 'second').value;
    const milisegundos = ahora.getMilliseconds().toString().padStart(3, '0');
    const timestamp = `${formatoFecha} ${hora}:${minutos}:${segundos}.${milisegundos}`;
    return timestamp;
}

async function crearActividad(req, reply) {
    try {
        // Valida el cuerpo de la solicitud

        const { body } = req;
        const { error, value } = actividadBodySchema.validate(body);
        const timestamp = await obtenerTimestamp();
        body.fecha_creacion = timestamp;
        const decoded = await req.jwtVerify();
        const rut = decoded.rut;
        const lider = await getLiderArray(body.id_agr);
        const rol = await getRolUsuario(rut, body.id_agr);
        const rolEnAgrupacion = rol.rol_agr;
        const agrupacion = await getAgrupacionById(body.id_agr);
        const cupos = body.cupos;
        if (!agrupacion) {
            return reply.code(404).send({ success: false, message: 'No se encontro la agrupacion' });
        }
        if (agrupacion.verificado !== 'Verificado' && body.tipo === true) {
            return reply.code(403).send({ success: false, message: 'La agrupacion no esta acreditada' });
        }
        if (rut !== lider[0].rut && rolEnAgrupacion !== 'Miembro oficial') {
            return reply.code(403).send({ success: false, message: 'No tienes permisos para crear actividades' });
        }
        if (rolEnAgrupacion === 'Miembro oficial' && body.tipo === true) {
            return reply.code(403).send({ success: false, message: 'No tienes permisos para crear actividades publicas' });
        }
        if (cupos > 10000) {
            return reply.code(403).send({ success: false, message: 'El numero de cupos no puede ser mayor a 10000' });
        }


        if (body.imagen === undefined) {
            body.imagen = 1;
        }

        if (error) {
            // Si hay un error, retorna un error de validación
            reply.code(400).send(error.details.map(detail => detail.message));
            return;
        }

        // Crea una nueva actividad
        const actividad = await createActividad(body);

        // Retorna la nueva actividad
        reply.code(201).send({ success: true, message: 'Actividad creada', data: actividad });
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar la actividad:', error);
        reply.code(500).send('Error al insertar la actividad');
    }
}



async function actualizarCuposActividad(req, res) {
    try {
        // Obtiene el id de la actividad
        const id_act = req.params.id_act;
        const cupos = req.body.cupos;
        const decoded = await req.jwtVerify();
        const rut = decoded.rut;
        const actividad = await getActividadById(id_act);
        if (actividad.length === 0) {
            return res.send({ success: false, message: 'No se encontro la actividad' });
        }
        const programacion = await getFechasActividades(id_act);
        const fecha = programacion.rows;

        if (fecha.length > 0) {
            return res.code(401).send({ success: false, message: 'La actividad ya tiene una fecha programada' });
        }
        const lider = await getLider(actividad.rows[0].id_agr);
        if (rut !== lider.rut) {
            return res.code(401).send({ success: false, message: 'No tienes permisos para modificar los cupos' });
        }
        const act = await updateCuposActividad(id_act, cupos);
        if (act) {
            return res.code(200).send({ success: true, message: 'Cupos actualizados', data: act });
        }
        return res.code(500).send({ success: false, message: 'Error al actualizar los cupos' });


    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar la actividad:', error);
        res.status(500).send('Error al actualizar la actividad');
    }
}

async function ObtenerCreadorActividad(req, res) {
    try {
        const id_act = req.params.id_act;
        const actividad = await getActividadById(id_act);
        const creador = await getLider(actividad.rows[0].id_agr);

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
        const decoded = await req.jwtVerify();
        const rut = decoded.rut;
        const actividad = await getActividadById(id_act);

        if (actividad.length === 0) {
            return res.send({ success: false, message: 'No se encontro la actividad' });
        }

        const lider = await getLider(actividad.rows[0].id_agr);
        const rol_usuario = await obtenerUsuarioPlataforma(rut);
        if (rut !== lider.rut && rol_usuario[0].rol !== 'Admin') {
            return res.send({ success: false, message: 'No tienes permisos para eliminar la actividad' });
        }
        // Elimina la actividad
        const validarEliminacion = await deleteActividad(id_act);
        if (validarEliminacion === 'Actividad eliminada') {
            return res.code(200).send({ success: true, message: 'Actividad eliminada' });
        }
        if (validarEliminacion === 'Actividad eliminada para los usuarios') {
            return res.code(200).send({ success: true, message: 'Actividad eliminada para los usuarios' });
        }
        return res.code(500).send({ success: false, message: 'Error al eliminar la actividad' });
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
        const decoded = await req.jwtVerify();
        const adminRol = decoded.rol;
        const datosActividad = await getActividadById(id_act);
        const datosAgrupacion = await getAgrupacionById(datosActividad.rows[0].id_agr);

        const lider = await getLiderArray(datosActividad.rows[0].id_agr);
        const liderCompleto = await validarUsuarioRut(lider[0].rut);
        const liderCorreo = liderCompleto.usuario.correo;
        if (adminRol !== 'Admin') {
            res.code(403).send({ success: false, message: 'No tienes permisos para eliminar la actividad' });
        }


        const respuesta = await deleteActividadPublica(id_act);
        if (respuesta !== 'Actividad eliminada') {
            return res.code(500).send({ success: false, message: 'Error al eliminar la actividad' });
        }
        // Notifica al lider 
        const mailDetails = {
            correo: liderCorreo,
            nombre_agr: datosAgrupacion.nombre_agr,
            nombre_act: datosActividad.rows[0].nom_act,
        };

        await notifyRechazarActPublica(mailDetails);

        // Retorna un mensaje de éxito
        res.status(200).send({ success: true, message: 'Actividad eliminada' });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Error al eliminar la actividad' });
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
        const decoded = await req.jwtVerify();
        const rutActual = decoded.rut;
        const lider = await getLider(id_agr);
        const rut = lider.rut;
        const rol = await getRolUsuario(rutActual, id_agr);
        const rolEnAgrupacion = rol.rol_agr;
        const act = await getActividadById(id_act);
        if (act.length === 0) {
            return res.send({ success: false, message: 'No se encontro la actividad' });
        }
        if (rutActual !== rut && rolEnAgrupacion !== 'Miembro oficial') {
            return res.code(401).send({ success: false, message: 'No tienes permisos para programar la actividad' });
        }
        const programacion = await getFechasActividades(id_act);

        const data = programacion.rows;
        if (data.length > 0) {
            return res.code(401).send({ success: false, message: 'La actividad ya tiene una fecha programada' });
        }
        const actividad = await setProgramacionActividad(id_agr, id_act, fecha_actividad);
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
        const decoded = await req.jwtVerify();
        const rut = decoded.rut;
        // Obtener actividad
        const miembro = await getRolUsuario(rut, id_act).rol_agr;
        const actividad = await getActividadById(id_act);
        if (miembro === 'Pendiente' && actividad.rows[0].tipo === false) {
            return res.code(401).send({ success: false, message: 'No puedes participar en esta actividad' });
        }
        if (actividad.rows[0].tipo === true && actividad.rows[0].aprobado === false) {
            return res.code(401).send({ success: false, message: 'La actividad no ha sido aprobada' });
        }
        const fecha = await getFechasActividades(id_act);
        if (!fecha.rows[0]) {
            return res.code(401).send({ success: false, message: 'La actividad no tiene fecha programada' });
        }
        // Obtener participantes de la actividad
        const participantes = await ParticipantesActividad(id_act);
        const cuposRestantes = actividad.rows[0].cupos - participantes.length;
        // Programa la actividad
        if (cuposRestantes <= 0) {
            return res.send({ success: false, message: 'No hay cupos disponibles' });
        }
        // Error si ya esta participando
        for (let i = 0; i < participantes.length; i++) {
            if (participantes[i].rut === rut) {
                return res.send({ success: false, message: 'Ya estas participando en esta actividad' });
            }
        }
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
            return res.code(400).send({ success: false, message: 'No se encontraron actividades' });
        }
        return res.code(200).send(actividades);
    } catch (error) {
        console.error('Error al obtener las actividades de los grupos del usuario:', error);
        return res.status(500).send({ success: false, message: 'Error al obtener las actividades de los grupos del usuario' });
    }
}
async function ParticipantesActividad(req, res) {
    try {
        const id_act = req;

        const participantes = await getParticipantesActividad(id_act);
        return participantes;
    } catch (error) {
        console.error('Error al obtener los participantes de la actividad:', error);
        return res.status(500).send({ success: false, message: 'Error al obtener los participantes de la actividad' });
    }
}
async function obtenerParticipantesActividad(req, res) {
    try {
        const { id_act } = req.params;

        const participantes = await getParticipantesActividad(id_act);
        if (participantes.length === 0) {
            return res.send({ success: false, message: 'No se encontraron participantes' });
        }
        return res.send({ success: true, participantes });
    } catch (error) {
        console.error('Error al obtener los participantes de la actividad:', error);
        return res.status(500).send({ success: false, message: 'Error al obtener los participantes de la actividad' });
    }
}

async function obtenerActividadesParticipante(req, res) {
    try {
        const { rut } = req.params;
        const decoded = await req.jwtVerify();
        if (rut !== decoded.rut && decoded.rol !== 'Admin') {
            return res.code(401).send({ success: false, message: 'No tienes permisos para ver las actividades de otro usuario' });
        }

        const actividades = await getActividadesParticipante(rut);
        if (actividades.length === 0) {
            return res.send({ success: false, message: 'No se encontraron actividades' });
        }
        return res.code(200).send(actividades);
    } catch (error) {
        console.error('Error al obtener las actividades del usuario:', error);
        return res.status(500).send({ success: false, message: 'Error al obtener las actividades del usuario' });
    }
}

async function obtenerActividadesParticipanteUsuario(req, res) {
    try {
        const { rut } = req.params;
        const actividades = await getActividadesParticipanteUsuario(rut);
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
        const datosActividad = await getActividadById(id_act);
        const datosAgrupacion = await getAgrupacionById(datosActividad.rows[0].id_agr);
        const lider = await getLiderArray(datosActividad.rows[0].id_agr);
        const liderCompleto = await validarUsuarioRut(lider[0].rut);
        const liderCorreo = liderCompleto.usuario.correo;

        const mailDetails = {
            lider_correo: liderCorreo,
            nombre_agr: datosAgrupacion.nombre_agr,
            nombre_act: datosActividad.rows[0].nom_act,
        };

        await notifyAprobarActPublica(mailDetails);

        if (actividad) {
            return res.code(200).send({ success: true, message: 'Actividad aprobada', data: actividad });
        }
        // Retorna la actividad programada
        res.code(500).send({ success: false, message: 'Error al aprobar la actividad' });
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al programar la actividad:', error);
        res.code(500).send({ error: 'Error al aprobar la actividad' });
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

async function ingresarTagsActividad(req, res) {
    try {
        const id_act = req.body.id_act;
        const tags = req.body.id_tag;
        const decoded = await req.jwtVerify();
        const rut = decoded.rut;
        const actividad = await getActividadById(id_act);
        if (!actividad) {
            return res.code(404).send({ success: false, message: 'No se encontró la actividad' });
        }
        const lider = await getLiderArray(actividad.rows[0].id_agr);
        if (rut !== lider[0].rut) {
            return res.code(401).send({ success: false, message: 'No tienes permisos para ingresar tags' });
        }
        const result = await insertTagsActividad(id_act, tags);
        if (!result) {
            return res.code(500).send({ success: false, message: 'Error al ingresar tags' });
        }
        res.code(200).send({ success: true, message: 'Tags ingresados correctamente' });
    } catch (error) {
        console.error('Error al ingresar tags:', error);
        res.code(500).send('Error al ingresar tags');
    }
}

async function obtenerTagsActividad(req, res) {
    try {
        const id_act = req.params.id_act;
        const tags = await getTagsActividad(id_act);
        if (!tags) {
            return res.send({ success: false, message: 'No se encontraron tags' });
        }
        let TagsConNombre = [];
        for (let i = 0; i < tags.length; i++) {
            const tagResult = await obtenerTagPorId(tags[i].id_tag);
            TagsConNombre.push(tagResult.rows[0]);
        }
        return res.send({ success: true, TagsConNombre });
    } catch (error) {
        console.error('Error al obtener los tags de la actividad:', error);
        return res.status(500).send({ success: false, message: 'Error al obtener los tags de la actividad' });
    }
}

async function obtenerProgramacionActividad(req, res) {
    try {
        const id_act = req.params.id_act;
        const response = await getFechasActividades(id_act);
        const fecha = response.rows;
        if (!fecha) {
            return res.code(404).send({ success: false, message: 'No se encontraron fechas' });
        }
        return res.code(200).send({ success: true, fecha });
    } catch (error) {
        console.error('Error al obtener las fechas de la actividad:', error);
        return res.status(500).send({ success: false, message: 'Error al obtener las fechas de la actividad' });
    }
}

async function ObtenerActividadesPorAgrupacionSinProgramar(req, res) {
    try {
        const actividades = await getActividadesSinProgramacion(req.params.id_agr);
        const actividadesNoProgramadas = actividades.rows;
        if (actividades.length === 0) {
            return res.send({ success: false, message: 'No se encontraron actividades sin programar' });
        }
        return res.code(200).send({ success: true, actividadesNoProgramadas });
    } catch (error) {
        console.error('Error al obtener las actividades de la agrupacion:', error);
        return res.status(500).send({ success: false, message: 'Error al obtener las actividades de la agrupacion' });
    }
}
module.exports = {
    ObtenerActividades,
    ObtenerActividadyAgrupacion,
    ObtenerActividadPorID,
    crearActividad,
    actualizarCuposActividad,
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
    ObtenerActividadesPublicas,
    obtenerParticipantesActividad,
    obtenerActividadesParticipanteUsuario,
    ingresarTagsActividad,
    obtenerTagsActividad,
    obtenerProgramacionActividad,
    ObtenerActividadesPorAgrupacionSinProgramar
};
