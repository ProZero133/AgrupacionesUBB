"use strict";

const { getAgrupaciones, getAgrupacionById, createAgrupacion, updateAgrupacion, getImage, createSolicitud } = require("../services/agrupacion.service.js");
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

module.exports = {
    VerGrupos,
    ObtenerAgrupacionesPorID,
    crearAgrupacion,
    editarAgrupacion,
    obtenerImagenAgrupacion,
    unirseAgrupacion
};