"use strict";

const { getAgrupaciones, getAgrupacionById, getRolUsuario, createAgrupacion, updateRolUsuario, getImage,
    createSolicitud, getSolicitudes, updateSolicitud, getLider, getLiderArray, validateEliminarGrupo,
    getUsuariosdeAgrupacion, deleteUsuarioAgrupacion, getAgrupacionesDeUsuario,
    rejectSolicitud, createSolicitarAcreditacion, insertTagsAgrupacion,
    getAgrupacionesPorNombre, getPublicacionCorreos, redeemCodigo, getAgrupacionesNoInscritas, getTagsAgrupacion,
    deleteTagAgrupacion, updateAgrupacion, getPertenece } = require("../services/agrupacion.service.js");
const { agrupacionBodySchema, agrupacionId } = require("../schema/agrupacion.schema.js");
const { getUsuarioByRut, getUsuarioByCorreo, obtenerUsuarioPlataforma } = require("../services/user.service.js");
const { obtenerPublicacionesPorId } = require("../controllers/publicacion.controller.js");
const { notifyPublicacion, integrateUsuario, inviteUsuario } = require("../services/mail.service.js");
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
            return res.code(401).send('Rut no pertece al usuario');
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
        if (lider[0].rut !== rut) {
            return res.code(401).send('No tienes permisos para editar la agrupacion')
        }
        const agrupacionactual = await getAgrupacionById(id_agr);
        if (agrupacionactual.length === 0) {
            return res.code(404).send('Agrupación no encontrada');
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
            return res.code(404).send('Agrupación no encontrada');
        }

        //buscar la agrupacion en la bdd
        const agrupacionDatos = await getAgrupacionById(id_agr);
        if (agrupacionDatos.length === 0) {
            return res.code(404).send('Agrupación no encontrada');
        }

        // crea el correo
        const result = await createSolicitud(rut, id_agr);
        if (!result) {
            return res.code(500).send('Error al enviar solicitud');
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

        // si el array de los lideres es igual a 1, no se puede cambiar el rol
        if (rol === 'Miembro oficial' || rol === 'Miembro') {
            const lideres = await getLiderArray(id_agr);
            if (lideres.length === 1) {
                return res.code(400).send('No se puede cambiar el rol del último líder');
            }
        }

        const usuario = await getUsuarioByRut(rut);
        if (usuario.length === 0) {
            return res.code(404).send('Usuario no encontrado');
        }

        const agrupacion = await getAgrupacionById(id_agr);
        if (agrupacion.length === 0) {
            return res.code(404).send('Agrupación no encontrada');
        }

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

        const lider = await getLiderArray(id_agr);
        if (lider[0].rut === rut) {
            // obtiene los miembros de la agrupacion y cambia el rol a lider al miembro mas antiguo de la agrupacion
            const miembros = await getUsuariosdeAgrupacion(id_agr);
            // busca por cada uno el usuario que tenga rol de miembro oficial o miembro y el primer usuario que encuentre que cumpla con esos roles le cambia el rol a lider de la agrupacion
            for (let i = 0; i < miembros.length; i++) {
                const rol = await getRolUsuario(miembros[i].rut, id_agr);
                if (rol.rol_agr === 'Miembro oficial' || rol.rol_agr === 'Miembro') {
                    const result = await updateRolUsuario(miembros[i].rut, id_agr, 'Lider');
                    if (!result) {
                        return res.code(500).send('Error al abandonar la agrupación');
                    }
                }
            }
        }

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
        return res.code(200).send({ succes: true, message: 'Invitación enviada' });
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
        const tags = await getTagsAgrupacion(id_agr);
        if (tags.length === 0) {
            return 0;
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

        const agrupacion = await getAgrupacionById(id_agr);
        if (!agrupacion) {
            return res.code(404).send('Agrupación no encontrada');
        }

        const tag = await obtenerTagPorId(id_tag);
        if (tag.rows.length === 0) {
            return res.code(404).send('Tag no encontrado');
        }

        const result = await deleteTagAgrupacion(id_agr, id_tag);
        if (!result) {
            return res.code(500).send('Error al eliminar el tag');
        }

        res.code(200).send('Tag eliminado');
    } catch (error) {
        console.error('Error al eliminar el tag:', error);
        res.code(500).send('Error al eliminar el tag');
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
};