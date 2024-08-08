"use strict";

const { getAgrupaciones, getAgrupacionById, getRolUsuario, createAgrupacion, updateRolUsuario, getImage,
    createSolicitud, getSolicitudes, updateSolicitud, getLider, validateEliminarGrupo,
    getUsuariosdeAgrupacion, deleteUsuarioAgrupacion, getAgrupacionesDeUsuario,
    rejectSolicitud, createSolicitarAcreditacion, insertTagsAgrupacion,
    getAgrupacionesPorNombre, getPublicacionCorreos, redeemCodigo, getAgrupacionesNoInscritas } = require("../services/agrupacion.service.js");
const { agrupacionBodySchema, agrupacionId } = require("../schema/agrupacion.schema.js");
const { getUsuarioByRut } = require("../services/user.service.js");
const { obtenerPublicacionesPorId } = require("../controllers/publicacion.controller.js");
const { notifyPublicacion, integrateUsuario } = require("../services/mail.service.js");

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
        console.error('Error al crear la agrupacionnn:', error);
        res.status(500).send('Error al crear la agrupacion');
    }
}

async function editarAgrupacion(req, res) {
    try {
        // Obtiene el id de la agrupacion
        const id_agr = req.params.id_agr;
        const agrupacionactual = await getAgrupacionById(id_agr);
        if (agrupacionactual.length === 0) {
            return res.code(404).send('Agrupación no encontrada');
        }
        const agrupa = agrupacionactual.rows[0];
        const verificado = agrupa.verificado;
        const fecha_verificacion = agrupa.fecha_verificacion;
        const rut = agrupa.rut;
        const fecha_creacion = agrupa.fecha_creacion;
        const imagen = agrupa.imagen;
        req.body.verificado = verificado;
        req.body.fecha_verificacion = fecha_verificacion;
        req.body.rut = rut;
        req.body.fecha_creacion = fecha_creacion;
        req.body.imagen = imagen;
        // Valida el cuerpo de la solicitud
        const { error, value } = agrupacionBodySchema.validate(req.body);

        if (error) {
            // Retorna un error si el cuerpo de la solicitud es inválido
            res.code(400).send(error.message);
            return;
        }
        // Actualiza la agrupacion
        const agrupacion = await updateAgrupacion(id_agr, req.body, verificado, fecha_verificacion, rut, fecha_creacion, imagen);

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
        const imagen = await getImage(idImagenAgrupacion.imagen);
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

        const lider = await getUsuarioByRut(agrupacion.rut);
        if (usuario.length === 0) {
            return res.code(404).send('Lider no encontrado');
        }

        const result = await createSolicitud(rut, id_agr);
        if (!result) {
            return res.code(500).send('Error al enviar solicitud');
        }

        const mailDetails = {
            rut: usuario[0].rut,
            nombre: usuario[0].nombre,
            lider_correo: lider[0].correo,
            nombre_agr: agrupacion.nombre_agr
        };

        const invitar = await integrateUsuario(mailDetails);

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

async function ObtenerUsuariosdeAgrupacion(req, res) {
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

async function obtenerLider(req, res) {
    try {
        const id_agr = req.params.id_agr;
        const lider = await getLider(id_agr);
        if (lider.length === 0) {
            return res.code(404).send('No se encontró el líder');
        }
        res.code(200).send(lider);
    } catch (error) {
        console.error('Error al obtener el líder:', error);
        res.code(500).send('Error al obtener el líder');
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
        const lider = usuarioEsLider;
        if (lider.rut !== rut) {
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

async function obtenerAgrupacionesDeUsuario(req, res) {
    try {
        const rut = req.params.rut;
        const user = await getUsuarioByRut(rut);
        if (user.length === 0) {
            return res.code(404).send('Usuario no encontrado');
        }
        const result = await getAgrupacionesDeUsuario(rut);
        if (result.length === 0) {
            return res.code(404).send('No se encontraron agrupaciones');
        }
        res.code(200).send(result);
    } catch (error) {
        console.error('Error al obtener las agrupaciones del usuario:', error);
        res.code(500).send('Error al obtener las agrupaciones del usuario');
    }
}

async function ObtenerRolUsuario(req, res) {
    try {
        const id_agr = req.params.id_agr;
        const rut = req.params.rut;
        
        const rolUsr = await getRolUsuario(rut, id_agr);
        
        res.code(200).send(rolUsr);
    } catch (error) {
        console.error('Error al obtener el rol del usuario:', error);
        res.code(500).send('Error al obtener el rol del usuario');
    }
}

async function CambiarRoldeUsuario(req, res) {
    try {
        const id_agr = req.params.id_agr;
        const rut = req.params.rut;
        const rol = req.body.rol_agr;


        const usuario = await getUsuarioByRut(rut);
        if (usuario.length === 0) {
            return res.code(404).send('Usuario no encontrado');
        }

        const agrupacion = await getAgrupacionById(id_agr);
        if (agrupacion.length === 0) {
            return res.code(404).send('Agrupación no encontrada');
        }
        /* 
                const usuarioEsLider = await getLider(id_agr);
                if (usuarioEsLider[0].rut !== rut) {
                    return res.code(401).send('No tienes permisos para cambiar el rol del usuario');
                }
         */
        const result = await updateRolUsuario(rut, id_agr, rol);

        if (!result) {
            return res.code(500).send('Error al cambiar el rol del usuario');
        }
        res.code(200).send('Rol cambiado');
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.code(500).send('Error al cambiar el rol del usuario');
    }
}

async function abandonarAgrupacion(req, res) {
    try {
        const id_agr = req.params.id_agr;
        const rut = req.params.rut;

        const user = await getUsuarioByRut(rut);
        if (user.length === 0) {
            return res.code(404).send('Usuario no encontrado');
        }
        const agrupacion = await getAgrupacionById(id_agr);
        if (agrupacion.length === 0) {
            return res.code(404).send('Agrupación no encontrada');
        }
/* 
        const usuarioEnAgrupacion = await obtenerAgrupacionesDeUsuario(rut);

        if (usuarioEnAgrupacion.length === 0) {
            return res.code(404).send('Usuario no pertenece a la agrupación');
        }
 */
        const result = await deleteUsuarioAgrupacion(rut, id_agr);
        if (!result) {
            return res.code(500).send('Error al abandonar la agrupación');
        }

        res.code(200).send('Agrupación abandonada');
    } catch (error) {
        console.error('Error al abandonar la agrupación:', error);
        res.code(500).send('Error al abandonar la agrupación');
    }
}


async function solicitarAcreditacion(req, res) {
    try {
        const id_agr = req.params.id_agr;
        const rut = req.params.rut;
        const usuario = await getUsuarioByRut(rut);
        if (usuario.length === 0) {
            return res.code(404).send('Usuario no encontrado');
        }
        const agrupacion = await getAgrupacionById(id_agr);
        if (agrupacion.length === 0) {
            return res.code(404).send('Agrupación no encontrada');
        }
        const result = await createSolicitarAcreditacion(id_agr, rut);
        if (!result) {
            return res.code(500).send('Error al enviar solicitud');
        }
        res.code(201).send(result);
    } catch (error) {
        console.error('Error al enviar solicitud:', error);
        res.code(500).send('Error al enviar solicitud');
    }
}

async function rechazarSolicitud(req, res) {
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
        const result = await rejectSolicitud(rut, id_agr);
        if (!result) {
            return res.code(500).send('Error al rechazar la solicitud');
        }
        res.code(200).send('Solicitud rechazada');
    } catch (error) {
        console.error('Error al rechazar la solicitud:', error);
        res.code(500).send('Error al rechazar la solicitud');
    }
}

async function ingresarTagsAgrupacion(req, res) {
    try {
        const id_agr = req.body.id_agr;
        const tags = req.body.id_tag;
        const agrupacion = await getAgrupacionById(id_agr);
        if (!agrupacion) {
            return res.code(404).send('Agrupación no encontrada');
        }
        const result = await insertTagsAgrupacion(id_agr, tags);
        if (!result) {
            return res.code(500).send('Error al ingresar tags');
        }
        res.code(200).send('Tags ingresados');
    } catch (error) {
        console.error('Error al ingresar tags:', error);
        res.code(500).send('Error al ingresar tags');
    }
}

async function VerGruposPorNombre(req, res) {
    try {
        const nombre_agr = req.params.nombre_agr;
        const agrupaciones = await getAgrupacionesPorNombre(nombre_agr);
        if (agrupaciones.length === 0) {
            return res.code(404).send('No se encontraron agrupaciones');
        }
        res.code(200).send(agrupaciones);
    } catch (error) {
        console.error('Error al obtener las agrupaciones por nombre:', error);
        res.code(500).send('Error al obtener las agrupaciones por nombre');
    }
}

async function notificarMiembrosPublicacion(req, res) {
    try {
        const id_pub = req.body.id_pub;

        const publicacion = await obtenerPublicacionesPorId(id_pub);

        if (publicacion.length === 0) {
            return res.code(404).send('Publicación no encontrada');
        }

        const agrupacion = await getAgrupacionById(publicacion.id_agr);
        if (agrupacion.length === 0) {
            return res.code(404).send('Agrupación no encontrada');
        }

        const infoRequest = await getPublicacionCorreos(publicacion.id_agr, id_pub);
        
        publicacion.correos = infoRequest;
        publicacion.nombre_agr = agrupacion.nombre_agr;

        const result = await notifyPublicacion(publicacion);

        res.code(200).send(publicacion);
    } catch (error) {
        console.error('Error al notificar a los miembros de la publicación:', error);
        res.code(500).send('Error al notificar a los miembros de la publicación');
    }
}

async function ingresarPorCodigo(req, res) {
    try {
        const rut = req.params.rut;
        const codigo = req.params.codigo;

        const usuario = await getUsuarioByRut(rut);
        if (usuario.length === 0) {
            return res.code(404).send('Usuario no encontrado');
        }

        const result = await redeemCodigo(codigo, rut);
        if (!result) {
            return res.code(500).send('Error al ingresar el código');
        }

        res.code(200).send(result);
    } catch (error) {
        console.error('Error al ingresar el código:', error);
        res.code(500).send('Error al ingresar el código');
    }
}

async function VerGruposNoInscritos(req, res) {
    try {
        const rut = req.params.rut;
        const usuario = await getUsuarioByRut(rut);
        if (usuario.length === 0) {
            return res.code(404).send('Usuario no encontrado');
        }
        const agrupacionesNoInscritas = await getAgrupacionesNoInscritas(rut);
        if (agrupacionesNoInscritas.length === 0) {
            return res.code(404).send('No se encontraron agrupaciones');
        }
        res.code(200).send(agrupacionesNoInscritas);
    } catch (error) {
        console.error('Error al obtener las agrupaciones no inscritas:', error);
        res.code(500).send('Error al obtener las agrupaciones no inscritas');
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
    eliminarAgrupacion,
    abandonarAgrupacion,
    obtenerAgrupacionesDeUsuario,
    ObtenerRolUsuario,
    CambiarRoldeUsuario,
    solicitarAcreditacion,
    rechazarSolicitud,
    ingresarTagsAgrupacion,
    VerGruposPorNombre,
    obtenerLider,
    notificarMiembrosPublicacion,
    ingresarPorCodigo,
    unirseAgrupacion,
    VerGruposNoInscritos
};