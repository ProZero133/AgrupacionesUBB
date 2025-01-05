"use strict";

const { getAgrupaciones, getAgrupacionById, getRolUsuario, createAgrupacion, updateRolUsuario, getImage,
    createSolicitud, getSolicitudes, updateSolicitud, getLider, getLiderArray, validateEliminarGrupo,
    getUsuariosdeAgrupacion, deleteUsuarioAgrupacion, getAgrupacionesDeUsuario,
    rejectSolicitud, createSolicitarAcreditacion, insertTagsAgrupacion,
    getAgrupacionesPorNombre, getPublicacionCorreos, redeemCodigo, getAgrupacionesNoInscritas, getTagsAgrupacion,
    deleteTagAgrupacion, updateAgrupacion, getPertenece, getAparienciaAgrupacion, updateAparienciaAgrupacion,
    updateRedesSociales } = require("../services/agrupacion.service.js");
const { agrupacionBodySchema, agrupacionId } = require("../schema/agrupacion.schema.js");
const { getUsuarioByRut, getUsuarioByCorreo, obtenerUsuarioPlataforma } = require("../services/user.service.js");
const { obtenerPublicacionesPorId } = require("../controllers/publicacion.controller.js");
const { notifyPublicacion, integrateUsuario, inviteUsuario, reportarAgrupacionCorreo } = require("../services/mail.service.js");
const { obtenerTagPorId } = require('../controllers/tags.controller.js');
const { validarUsuario } = require('../services/auth.service.js');
const crypto = require('crypto')
const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = Buffer.from('aluecr2etfsyg2345578h01234g67890', 'utf-8');
const IV = Buffer.alloc(16, 0);
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
        const decoded = await req.jwtVerify();
        const rut = decoded.rut;
        const rol = decoded.rol;
        if (rut !== req.body.rut) {
            return res.code(401).send('Rut no pertenece al usuario');
        }
        if (rol !== 'Estudiante') {
            return res.code(401).send('No tienes permisos para crear una agrupacion')
        }
        if (error) {
            // Retorna un error si el cuerpo de la solicitud es inválido
            res.code(400).send(error.details.map(detail => detail.message));
            return;
        }
        const fechaActual = new Date();
        req.body.fecha_creacion = fechaActual;
        req.body.verificado = "Noverificado";
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
        const lider = await getLiderArray(id_agr);
        const decoded = await req.jwtVerify();
        const rut = decoded.rut;
        const agrupacionactual = await getAgrupacionById(id_agr);
        if (!agrupacionactual) {
            return res.code(404).send('Agrupación no encontrada');
        }
        if (lider[0].rut !== rut) {
            return res.code(401).send('No tienes permisos para editar la agrupacion')
        }
        const agrupa = agrupacionactual
        const imagen = agrupa.imagen;
        req.body.rut = agrupa.rut;
        req.body.imagen = imagen;
        // Valida el cuerpo de la solicitud
        const { error, value } = agrupacionBodySchema.validate(req.body);

        if (error) {
            // Retorna un error si el cuerpo de la solicitud es inválido
            res.code(400).send(error.message);
            return;
        }
        // Actualiza la agrupacion
        const agrupacion = await updateAgrupacion(id_agr, req.body, rut, imagen);

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
        // buscar al usuario en la base de datos
        const rut = req.params.rut;
        const id_agr = req.params.id_agr;
        const usuario = await getUsuarioByRut(rut);
        const usuarioCompleto = await validarUsuario(usuario.correo)
        if (usuarioCompleto.length === 0) {
            return res.code(404).send('Usuario no encontrado');
        }

        //buscar al lider de la agrupacion en la bdd
        const Lider = await getLiderArray(id_agr);
        const LiderCompleto = await getUsuarioByRut(Lider[0].rut);
        if (Lider.length === 0) {
            return res.code(404).send({ success: false, message: 'Lider no encontrado' });
        }

        //buscar la agrupacion en la bdd
        const agrupacionDatos = await getAgrupacionById(id_agr);
        if (agrupacionDatos.length === 0) {
            return res.code(404).send({ success: false, message: 'Agrupación no encontrada' });
        }

        // crea el correo
        const result = await createSolicitud(rut, id_agr);
        if (!result) {
            return res.code(500).send({ success: false, message: 'Error al enviar solicitud' });
        }

        const mailDetails = {
            rut: usuarioCompleto.usuario.rut,
            nombre: usuarioCompleto.usuario.nombre,
            lider_correo: LiderCompleto.correo,
            nombre_agr: agrupacionDatos.nombre_agr,
            carrera: usuarioCompleto.usuario.carrera
        };

        await integrateUsuario(mailDetails);

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
            return res.send({ success: false, message: 'No se encontraron solicitudes' });
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
        if (result === 'El usuario ya es miembro de la agrupación') {
            return res.code(400).send({ success: false, message: 'El usuario ya es miembro de la agrupación' });
        }
        res.code(200).send({ success: true, message: 'Solicitud aceptada' });
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
            return 0;
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

async function obtenerLiderArray(req, res) {
    try {
        const id_agr = req.params.id_agr;
        const lider = await getLiderArray(id_agr);
        res.code(200).send(lider);
    } catch (error) {
        console.error('Error al obtener el líder:', error);
        res.code(500).send('Error al obtener el líder');
    }
}

async function eliminarAgrupacion(req, res) {
    try {
        const id_agr = req.params.id_agr;
        const decoded = await req.jwtVerify();
        const rol = decoded.rol;
        const rut = decoded.rut;
        const user = await getUsuarioByRut(rut);
        if (user.length === 0) {
            return res.code(404).send('Usuario no encontrado');
        }
        const usuarioEsLider = await getLider(id_agr);
        const lider = usuarioEsLider;
        if (lider.rut !== rut && rol !== 'Admin') {
            return res.code(401).send('No tienes permisos para eliminar la agrupación');
        }
        const result = await validateEliminarGrupo(id_agr);
        if (!result) {
            return res.code(500).send('Error al eliminar la agrupación');
        }
        res.code(200).send({ success: true, message: 'Agrupación eliminada', data: result });
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

async function obtenerAgrupacionesPertenece(req, res) {
    try {
        const rut = req.params.rut;
        const user = await getUsuarioByRut(rut);
        if (user.length === 0) {
            return res.code(404).send('Usuario no encontrado');
        }
        const pertenencia = await getPertenece(rut);
        if (pertenencia.length === 0) {
            return res.code(404).send('No se encontraron agrupaciones');
        }
        res.code(200).send(pertenencia);
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

        const decoded = await req.jwtVerify();
        const rutActual = decoded.rut;
        const rolActual = decoded.rol;
        const lider = await getLiderArray(id_agr);
        const rutLider = lider[0].rut;

        if (rol !== 'Miembro oficial' && rol !== 'Miembro' && rol !== 'Lider') {
            return res.code(400).send({ success: false, message: 'Rol no válido' });
        }

        if (rolActual !== 'Admin' && rutActual !== rutLider) {
            return res.code(401).send('No tienes permisos para cambiar el rol del usuario');
        }

        const usuario = await getUsuarioByRut(rut);
        if (usuario.length === 0) {
            return res.code(404).send('Usuario no encontrado');
        }

        const agrupacion = await getAgrupacionById(id_agr);
        if (agrupacion.length === 0) {
            return res.code(404).send('Agrupación no encontrada');
        }
        const miembros = await getUsuariosdeAgrupacion(id_agr);

        if (miembros.length === 1) {
            return res.code(400).send({ success: false, message: 'No se puede cambiar el rol del último usuario de la agrupación' });
        }
        let existe = false;
        for (let i = 0; i < miembros.length; i++) {
            if (miembros[i].rut === rut) {
                existe = true;
                break;
            }
        }
        if (!existe) {
            return res.code(400).send({ success: false, message: 'El usuario no pertenece a la agrupación' });
        }

        if (rut === rutLider && rol !== 'Lider') {
            let CandidatoALider = 0;
            let fechaIntegracion = new Date();
            for (let i = 0; i < miembros.length; i++) {
                const rolMiembro = await getRolUsuario(miembros[i].rut, id_agr);
                if (rolMiembro.rol_agr === 'Miembro oficial' || rolMiembro.rol_agr === 'Miembro') {
                    if (rolMiembro.fecha_integracion < fechaIntegracion) {
                        CandidatoALider = rolMiembro.rut;
                        fechaIntegracion = rolMiembro.fecha_integracion;
                        continue;
                    }

                }
            }
            const result = await updateRolUsuario(CandidatoALider, id_agr, 'Lider');
            if (!result) {
                return res.code(500).send({ success: false, message: 'Error al cambiar el rol del nuevo lider' });
            }
            const response = await updateRolUsuario(rut, id_agr, rol);
            if (!response) {
                return res.code(500).send('Error al cambiar el rol del usuario');
            }
            return res.code(200).send({ success: true, message: 'Rol cambiado para el usuario actual y nuevo lider' });
        }

        if(rut !== rutLider && rol === 'Lider'){
            const response = await updateRolUsuario(rutLider, id_agr, 'Miembro oficial');
            if (!response) {
                return res.code(500).send('Error al cambiar el rol del antiguo lider');
            }
        }

        const result = await updateRolUsuario(rut, id_agr, rol);
        if (!result) {
            return res.code(500).send('Error al cambiar el rol del usuario');
        }
        res.code(200).send({ success: true, message: 'Rol cambiado para el usuario' });
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.code(500).send('Error al cambiar el rol del usuario');
    }
}




async function abandonarAgrupacion(req, res) {
    try {
        const id_agr = req.params.id_agr;
        const rut = req.params.rut;
        const decoded = await req.jwtVerify();
        const rutActual = decoded.rut;
        const user = await getUsuarioByRut(rut);
        if (user.length === 0) {
            return res.code(404).send('Usuario no encontrado');
        }

        const agrupacion = await getAgrupacionById(id_agr);
        if (agrupacion.length === 0) {
            return res.code(404).send('Agrupación no encontrada');
        }
        const miembros = await getUsuariosdeAgrupacion(id_agr);
        let existe = false;
        for (let i = 0; i < miembros.length; i++) {
            if (miembros[i].rut === rut) {
                existe = true;
                break;
            }
        }
        if (!existe) {
            return res.code(400).send({ success: false, message: 'El usuario no pertenece a la agrupación' });
        }

        const lider = await getLiderArray(id_agr);
        const rutLider = lider[0].rut;
        const rol = await getRolUsuario(rut, id_agr);
        if (rol.rol_agr !== 'Lider' && rutActual !== rut) {
            return res.code(401).send({ success: false, message: 'No tienes permisos para eliminar miembros' });
        }
        if (rut === rutLider) {
            let CandidatoALider = 0;
            let fechaIntegracion = new Date();
            for (let i = 0; i < miembros.length; i++) {
                const rolMiembro = await getRolUsuario(miembros[i].rut, id_agr);
                if (rolMiembro.rol_agr === 'Miembro oficial' || rolMiembro.rol_agr === 'Miembro') {
                    if (rolMiembro.fecha_integracion < fechaIntegracion) {
                        CandidatoALider = rolMiembro.rut;
                        fechaIntegracion = rolMiembro.fecha_integracion;
                        continue;
                    }

                }
            }
            const result = await updateRolUsuario(CandidatoALider, id_agr, 'Lider');
            if (!result) {
                return res.code(500).send({ success: false, message: 'Error al cambiar el rol del nuevo lider' });
            }
        }

        const result = await deleteUsuarioAgrupacion(rut, id_agr);
        if (!result) {
            return res.code(500).send('Error al abandonar la agrupación');
        }
        if (result === 'Agrupacion eliminada por falta de miembros') {
            return res.code(200).send({ success: true, message: 'Agrupación eliminada por falta de miembros' });
        }
        res.code(200).send({ success: true, message: 'Usuario eliminado de la agrupación' });
    } catch (error) {
        console.error('Error al abandonar la agrupación:', error);
        res.code(500).send('Error al abandonar la agrupación');
    }
}


async function solicitarAcreditacion(req, res) {
    try {
        const id_agr = req.params.id_agr;
        const decoded = await req.jwtVerify();
        const rut = decoded.rut;
        const usuario = await getUsuarioByRut(rut);
        if (usuario.length === 0) {
            return res.code(404).send('Usuario no encontrado');
        }
        const agrupacion = await getAgrupacionById(id_agr);
        if (agrupacion.length === 0) {
            return res.code(404).send('Agrupación no encontrada');
        }
        const integrantes = await getUsuariosdeAgrupacion(id_agr);
        if (integrantes.length < 3) {
            return res.code(400).send('La agrupación debe tener al menos 3 integrantes');
        }
        const rutLider = agrupacion.rut;
        if (rutLider !== rut) {
            return res.code(401).send('No tienes permisos para solicitar la acreditación');
        }
        const result = await createSolicitarAcreditacion(id_agr, rut);
        if (typeof result !== 'object') {
            return res.code(400).send(result);
        }
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
        const decoded = await req.jwtVerify();
        const rut = decoded.rut;
        const rolEnAgrupacion = await getRolUsuario(rut, id_agr);
        if (rolEnAgrupacion.rol_agr !== 'Lider') {
            return res.code(401).send('No tienes permisos para ingresar tags');
        }
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
async function invitarUsuario(req, res) {
    try {
        const decoded = await req.jwtVerify();
        const rutActual = decoded.rut;
        const mail = req.body.mail;
        const id_agr = req.body.id_agr;

        const rol = await getRolUsuario(rutActual, id_agr);
        if (rol.rol_agr !== 'Lider' && rol.rol_agr !== 'Admin' && rol.rol_agr !== 'Miembro oficial') {
            return res.code(401).send({ success: false, message: 'No tienes permisos para invitar a un usuario' });
        }
        const agrupacion = await getAgrupacionById(id_agr);
        if (agrupacion.length === 0) {
            return res.code(404).send({ success: false, message: 'Agrupación no encontrada' });
        }
        const usuario = await getUsuarioByCorreo(mail);
        if (usuario.length === 0) {
            return res.code(404).send({ success: false, message: 'Usuario no encontrado' });
        }
        const usuarioPLataforma = await obtenerUsuarioPlataforma(usuario.rut);
        if (usuarioPLataforma.length === 0) {
            return res.code(404).send({ success: false, message: 'Usuario no encontrado' });
        }
        if (usuarioPLataforma[0].rol === 'Admin') {
            return res.code(401).send({ success: false, message: 'No puedes invitar a un administrador' });
        }
        const rut = usuarioPLataforma[0].rut;

        const data = `${rut}|${id_agr}`;
        const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, IV);
        const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]).toString('base64');
        const invitacion = {
            nombre_agr: agrupacion.nombre_agr,
            correo: req.body.mail,
            nombre: usuario.nombre,
            codigo: encrypted
        };
        const invitar = await inviteUsuario(invitacion);
        if (!invitar) {
            return res.code(500).send({ success: false, message: 'Error al invitar al usuario' });
        }
        return res.code(200).send({ succes: true, message: 'Invitación enviada', data: encrypted });
    } catch (error) {
        console.error('Error al ingresar el código:', error);
        res.code(500).send('Error al ingresar el código');
    }
}

async function ingresarPorCodigo(req, res) {
    try {
        const decoded = await req.jwtVerify();
        const rutActual = decoded.rut;
        const rol = decoded.rol;
        if (rol !== 'Estudiante') {
            return res.code(401).send({ success: false, message: 'No tienes permisos para ingresar a una agrupación' });
        }
        const { codigo } = req.body;
        const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, IV);
        const encryptedData = Buffer.from(codigo, 'base64'); // Decodificar de Base64
        const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
        const [rut, id_agr] = decrypted.toString('utf8').split('|').map(str => str.trim());

        if (rut !== rutActual) {
            return res.code(401).send({ success: false, message: 'El código no corresponde al usuario' });
        }
        const miembro = await getRolUsuario(rutActual, id_agr);
        if (miembro) {
            return res.code(401).send({ success: false, message: 'Ya eres miembro de la agrupación' });
        }
        const ingresar = await redeemCodigo(rut, id_agr);
        if (!ingresar) {
            return res.code(500).send({ success: false, message: 'Error al ingresar a la agrupación' });
        }
        return res.code(200).send({ success: true, message: 'Ingreso exitoso', data: ingresar });


    } catch (error) {
        console.error('Error al invitar al usuario:', error);
        res.code(500).send('Error al invitar al usuario');
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

async function ObtenerTagsAgrupacion(req, res) {
    try {
        const id_agr = req.params.id_agr;
        const agrupacion = await getAgrupacionById(id_agr);
        if (!agrupacion) {
            return res.code(404).send({ success: false, message: 'Agrupación no encontrada' });
        }
        const tags = await getTagsAgrupacion(id_agr);
        if (!tags) {
            return [];
        }

        for (const tag of tags) {
            const tagInfo = await obtenerTagPorId(tag.id_tag);
            if (tagInfo.rows.length > 0) {
                tag.nombre_tag = tagInfo.rows[0].nombre_tag;
            }
        }
        res.code(200).send(tags);
    } catch (error) {
        console.error('Error al obtener los tags de la agrupación:', error);
        res.code(500).send('Error al obtener los tags de la agrupación');
    }
}

async function eliminarTagAgrupacion(req, res) {
    try {
        const id_agr = req.params.id_agr;
        const id_tag = req.params.id_tag;
        const decoded = await req.jwtVerify();
        const rut = decoded.rut;
        const lider = await getLiderArray(id_agr);
        if (lider[0].rut !== rut) {
            return res.code(401).send({ success: false, message: 'No tienes permisos para eliminar el tag' });
        }

        const agrupacion = await getAgrupacionById(id_agr);
        if (!agrupacion) {
            return res.code(404).send({ success: false, message: 'Agrupación no encontrada' });
        }

        const tag = await obtenerTagPorId(id_tag);
        if (tag.rows.length === 0) {
            return res.code(404).send({ success: false, message: 'Tag no encontrado' });
        }

        const result = await deleteTagAgrupacion(id_agr, id_tag);
        if (!result) {
            return res.code(500).send({ success: false, message: 'Error al eliminar el tag' });
        }

        res.code(200).send({ success: true, message: 'Tag eliminado' });
    } catch (error) {
        console.error('Error al eliminar el tag:', error);
        res.code(500).send('Error al eliminar el tag');
    }
}

async function obtenerAparienciaAgrupacion(req, res) {
    try {
        const { id_agr } = req.params;
        const agrupacion = await getAgrupacionById(id_agr);
        if (!agrupacion) {
            return res.status(404).send({ success: false, message: 'Agrupación no encontrada' });
        }
        const apariencia = await getAparienciaAgrupacion(id_agr);
        if (apariencia) {
            return res.status(200).send({ success: true, data: apariencia });
        } else {
            return res.status(404).send({ success: false, message: 'Apariencia no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener la apariencia de la agrupación:', error);
        res.code(500).send('Error al obtener la apariencia de la agrupación');
    }
}
async function actualizarAparienciaAgrupacion(req, res) {
    try {
        const { id_agr } = req.params;
        const apariencia = req.body;
        const decoded = await req.jwtVerify();
        const rut = decoded.rut;
        const rol = decoded.rol;
        const lider = await getLiderArray(id_agr);
        if (lider[0].rut !== rut) {
            return res.status(401).send({ success: false, message: 'No tienes permisos para editar la apariencia de la agrupación' });
        }
        if (rol !== 'Estudiante') {
            return res.status(401).send({ success: false, message: 'No tienes permisos para editar la apariencia de la agrupación' });
        }
        const agrupacion = await getAgrupacionById(id_agr);
        if (!agrupacion) {
            return res.status(404).send({ success: false, message: 'Agrupación no encontrada' });
        }
        const updatedApariencia = await updateAparienciaAgrupacion(id_agr, apariencia);
        if (updatedApariencia) {
            return res.status(200).send({ success: true, data: updatedApariencia });
        } else {
            return res.status(404).send({ success: false, message: 'Apariencia no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la apariencia de la agrupación:', error);
        return res.status(500).send({ success: false, message: 'Error al actualizar la apariencia de la agrupación' });
    }
}

async function actualizarRedesSociales(req, res) {
    try {
        const { id_agr } = req.params;
        const redes = req.body;
        if (!redes) {
            return res.status(400).send({ success: false, message: 'Falta información' });
        }
        const decoded = await req.jwtVerify();
        const rut = decoded.rut;
        const rol = decoded.rol;
        const lider = await getLiderArray(id_agr);
        if (lider[0].rut !== rut) {
            return res.status(401).send({ success: false, message: 'No tienes permisos para editar las redes sociales de la agrupación' });
        }
        if (rol !== 'Estudiante') {
            return res.status(401).send({ success: false, message: 'No tienes permisos para editar las redes sociales de la agrupación' });
        }
        const agrupacion = await getAgrupacionById(id_agr);
        if (!agrupacion) {
            return res.status(404).send({ success: false, message: 'Agrupación no encontrada' });
        }
        const updatedRedes = await updateRedesSociales(id_agr, redes);
        if (updatedRedes) {
            return res.status(200).send({ success: true, message: 'Redes sociales actualizadas', data: updatedRedes });
        } else {
            return res.status(404).send({ success: false, message: 'Redes sociales no encontradas' });
        }
    } catch (error) {
        console.error('Error al actualizar las redes sociales de la agrupación:', error);
        return res.status(500).send({ success: false, message: 'Error al actualizar las redes sociales de la agrupación' });
    }

}

async function reportarAgrupacion(req, res) {
    try {
        const id_agr = req.params.id_agr;
        const rut = req.params.rut;
        const motivo = req.body.motivo;

        const agrupacion = await getAgrupacionById(id_agr);
        const usuario = await getUsuarioByRut(rut);

        const mailDetails = {
            rut: usuario.rut,
            nombre: usuario.nombre,
            lider_correo: usuario.correo,
            nombre_agr: agrupacion.nombre_agr,
            motivo: motivo
        };

        await reportarAgrupacionCorreo(mailDetails);


    } catch (error) {
        console.error('Error al reportar la agrupación:', error);
        return { success: false, message: 'Error al reportar la agrupación' };
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
    VerGruposNoInscritos,
    ObtenerTagsAgrupacion,
    eliminarTagAgrupacion,
    obtenerLiderArray,
    obtenerAgrupacionesPertenece,
    invitarUsuario,
    obtenerAparienciaAgrupacion,
    actualizarAparienciaAgrupacion,
    actualizarRedesSociales,
    reportarAgrupacion,
};