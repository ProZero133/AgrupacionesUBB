"use strict";

const { getAgrupaciones, getAgrupacionById, createAgrupacion, updateAgrupacion, getImage, createSolicitud, getSolicitudes, updateSolicitud, getLider, validateEliminarGrupo, getUsuariosdeAgrupacion } = require("../services/agrupacion.service.js");
const { agrupacionBodySchema, agrupacionId } = require("../schema/agrupacion.schema.js");
const { getUsuarioByRut } = require("../services/user.service.js");

async function VerGrupos(request, reply) {
    const agrupaciones = await getAgrupaciones();
    if (agrupaciones.length === 0) {
        return reply.send({ success: false, message: 'No se encontraron agrupaciones' });
    }
    else {

        return reply.send(agrupaciones);

    }
}

async function ObtenerAgrupacionesPorID(req, res) {
    try {
        // Obtiene el id de la agrupacion
        const id = req.params.id;

        // Obtiene la agrupacion por su id
        const agrupacion = await getAgrupacionById(id);

        // Retorna la agrupacion
        res.code(201).send(agrupacion);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener la agrupacion:', error);
        res.status(500).send('Error al obtener la agrupacion');
    }
}

async function crearAgrupacion(req, res) {
    try {
        // Valida el cuerpo de la solicitud
        const { error, value } = agrupacionBodySchema.validate(req.body);

        if (error) {
            // Retorna un error si el cuerpo de la solicitud es inválido
            res.code(400).send(error.details.map(detail => detail.message));
            return;
        }
        const fechaActual = new Date();
        req.body.fecha_creacion = fechaActual;
        // Crea una nueva agrupacion
        const agrupacion = await createAgrupacion(req.body);

        // Retorna la nueva agrupacion
        res.code(201).send(agrupacion);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al crear la agrupacion:', error);
        res.status(500).send('Error al crear la agrupacion');
    }
}

async function editarAgrupacion(req, res) {
    try {
        // Obtiene el id de la agrupacion
        const id = req.params.id;

        // Valida el cuerpo de la solicitud
        const { error, value } = agrupacionBodySchema.validate(req.body);

        if (error) {
            // Retorna un error si el cuerpo de la solicitud es inválido
            res.code(400).send(error.message);
            return;
        }

        // Actualiza la agrupacion
        const agrupacion = await updateAgrupacion(id, req.body);

        // Retorna la agrupacion actualizada
        res.code(200).send(agrupacion);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar la agrupacion:', error);
        res.code(500).send('Error al actualizar la agrupacion');
    }
}
async function obtenerImagenAgrupacion(req, res) {
    try {
        const id = req.params.id;
        const idImagenAgrupacion = await getAgrupacionById(id);
        const imagen = await getImage(idImagenAgrupacion.rows[0].imagen);
        if (!idImagenAgrupacion) {
            return res.code(404).send('Agrupación no encontrada');
        }
        res.code(200).send(imagen);
    } catch (error) {
        console.error('Error al obtener la imagen de la agrupación:', error);
        res.code(500).send('Error al obtener la imagen de la agrupación');
    }
}

async function unirseAgrupacion(req, res) {
    try {
        const rut = req.params.rut;
        const id_agr = req.params.id_agr;
        const usuario = await getUsuarioByRut(rut);
        if (usuario.length === 0) {
            return res.code(404).send('Usuario no encontrado');
        }
        const agrupacion = await getAgrupacionById(id_agr);
        if (agrupacion.length === 0) {
            return res.code(404).send('Agrupación no encontrada');
        }
        const result = await createSolicitud(rut, id_agr);
        if (!result) {
            return res.code(500).send('Error al enviar solicitud');
        }
        res.code(201).send(result);
    } catch (error) {
        console.error('Error al enviar solicitud:', error);
        res.code(500).send('Error al enviar solicitud');
    }
}

async function solicitudesAgrupacion(req, res) {
    try {
        const id_agr = req.params.id_agr;
        const result = await getSolicitudes(id_agr);
        if (result.length === 0) {
            return res.code(404).send('No hay solicitudes pendientes');
        }
        res.code(200).send(result);
    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        res.code(500).send('Error al obtener solicitudes');

    }
}

async function aceptarSolicitud(req, res) {
    try {
        const rut = req.params.rut;
        const id_agr = req.params.id_agr;
        const usuario = await getUsuarioByRut(rut);
        if (usuario.length === 0) {
            return res.code(404).send('Usuario no encontrado');
        }
        const agrupacion = await getAgrupacionById(id_agr);
        if (agrupacion.length === 0) {
            return res.code(404).send('Agrupación no encontrada');
        }
        const result = await updateSolicitud(rut, id_agr);
        if (!result) {
            return res.code(500).send('Error al aceptar la solicitud');
        }
    }
    catch (error) {
        console.error('Error al aceptar la solicitud:', error);
        res.code(500).send('Error al aceptar la solicitud');
    }
}

async function ObtenerUsuariosdeAgrupacion (req, res) {
    try {
        const id = req.params.id_agr;
        const usuarios = await getUsuariosdeAgrupacion(id);
        if (usuarios.length === 0) {
            return res.code(404).send('No se encontraron usuarios');
        }
        res.code(200).send(usuarios);
    } catch (error) {
        console.error('Error al obtener los usuarios de la agrupación:', error);
        res.code(500).send('Error al obtener los usuarios de la agrupación');
    }
}



async function eliminarAgrupacion(req, res) {
    try {
        const id_agr = req.params.id_agr;
        const rut = req.params.rut;
        const user = await getUsuarioByRut(rut);
        if (user.length === 0) {
            return res.code(404).send('Usuario no encontrado');
        }
        const usuarioEsLider = await getLider(id_agr);
        //si el rut no es lider de la agrupacion
        if (usuarioEsLider[0].rut !== rut) {
            return res.code(401).send('No tienes permisos para eliminar la agrupación');
        }
        const result = await validateEliminarGrupo(id_agr);
        if (!result) {
            return res.code(500).send('Error al eliminar la agrupación');
        }
        res.code(200).send('Agrupación eliminada');
    } catch (error) {
        console.error('Error al eliminar la agrupación:', error);
        res.code(500).send('Error al eliminar la agrupación');
    }
}

module.exports = {
        VerGrupos,
        ObtenerAgrupacionesPorID,
        crearAgrupacion,
        editarAgrupacion,
        obtenerImagenAgrupacion,
        unirseAgrupacion,
        solicitudesAgrupacion,
        aceptarSolicitud,
        ObtenerUsuariosdeAgrupacion,
        eliminarAgrupacion
    };