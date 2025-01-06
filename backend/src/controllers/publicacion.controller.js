"use strict";

const { getPublicacion, getPublicacionById, createPublicacion, updatePublicacion,
    deletePublicacion, getPublicacionesByAgrupacion, getPublicacionesByGrupoUsuario, insertTagsPublicacion,
    getTagsPublicacion } = require("../services/publicacion.service.js");
const { getPostById } = require("../services/post.service.js");
const { getFormularioById } = require("../services/formulario.service");
const { getLiderArray } = require("../services/agrupacion.service.js");
const { obtenerTagPorId } = require('../controllers/tags.controller.js');
const { publicacionBodySchema } = require("../schema/publicacion.schema.js");

/**
 * Obtiene todas las publicaciones
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function obtenerPublicaciones(req, res) {
    try {
        // Obtiene todas las publicaciones
        const publicaciones = await getPublicacion();

        // Retorna las publicaciones
        res.code(200).send(publicaciones);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener las publicaciones:', error);
        res.code(500).send('Error al obtener las publicaciones');
    }
}

/**
 * Obtiene una publicacion por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function obtenerPublicacionesPorId(req, res) {
    try {
        // Obtiene el id de la publicacion
        let id = null;

        if (!req.params) {
            if (!req) {
                return res.code(400).send('No se ha especificado un id de publicación');
            } else {
                id = req;
            }
        } else {
            id = req.params.id;
        }


        // Obtiene la publicacion por su id
        const pub = await getPublicacionById(id);
        const publicacion = pub.rows[0];

        if (!publicacion) {
            if (res) {
                return res.code(404).send('Publicacion no encontrada');
            } else {
                return 'Publicacion no encontrada';
            }
        }

        try {
            const post = await getPostById(publicacion.id_pub);
            if (post) {
                publicacion.descripcion = post.cuerpo;
                publicacion.tipoPub = 'post';
            } else {
                publicacion.descripcion = 'No hay descripción disponible';
                publicacion.tipoPub = 'nulo';
            }
        } catch (error) {
            console.error(`Error al obtener el post con id ${publicacion.id_pub}: `, error);
            publicacion.descripcion = 'No hay descripción disponible';
            publicacion.tipoPub = 'nulo';
        }

        if (publicacion.tipoPub === 'nulo') {
            try {
                const formulario = await getFormularioById(publicacion.id_pub);
                if (formulario) {
                    publicacion.descripcion = formulario.descripcion;
                    publicacion.hipervinculo = formulario.hipervinculo;
                    publicacion.tipoPub = 'formulario';
                } else {
                    publicacion.descripcion = 'No hay descripción disponible';
                    publicacion.tipoPub = 'nulo';
                }
            } catch (error) {
                console.error(`Error al obtener el formulario con id ${publicacion.id_pub}: `, error);
                publicacion.descripcion = 'No hay descripción disponiblee';
                publicacion.tipoPub = 'nulo';
            }
        }

        // Retorna la publicacion procesada
        if (res) {
            return res.code(200).send(publicacion);
        } else {
            return publicacion;
        }

    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener la publicacion:', error);
        res.code(500).send('Error al obtener la publicacion');
    }
}

async function obtenerPublicacionesPorGrupo(req, res) {
    try {
        const respuesta = await getPublicacionesByAgrupacion(req.params.id);
        if (respuesta.length === 0) {
            return res.send({ success: false, message: 'No se encontraron publicaciones en la agrupación ' + req.params.id });
        } else {
            // Procesar cada elemento en la respuesta
            for (let i = 0; i < respuesta.length; i++) {
                const publicacion = respuesta[i];
                try {
                    const post = await getPostById(publicacion.id_pub);
                    if (post) {
                        publicacion.descripcion = post.cuerpo;
                        publicacion.tipoPub = 'post';
                    } else {
                        publicacion.descripcion = 'No hay descripción disponible';
                        publicacion.tipoPub = 'nulo';
                    }
                } catch (error) {
                    console.error(`Error al obtener el post con id ${publicacion.id_pub}: `, error);
                    publicacion.descripcion = 'No hay descripción disponible';
                    publicacion.tipoPub = 'nulo';
                }
            }

            // Procesar publicaciones que son formularios
            for (let i = 0; i < respuesta.length; i++) {
                const publicacion = respuesta[i];
                if (publicacion.tipoPub === 'nulo') {
                    try {
                        const formulario = await getFormularioById(publicacion.id_pub);
                        if (formulario) {
                            publicacion.descripcion = formulario.descripcion;
                            publicacion.hipervinculo = formulario.hipervinculo;
                            publicacion.tipoPub = 'formulario';
                        } else {
                            publicacion.descripcion = 'No hay descripción disponible';
                            publicacion.tipoPub = 'nulo';
                        }
                    } catch (error) {
                        console.error(`Error al obtener el formulario con id ${publicacion.id_pub}: `, error);
                        publicacion.descripcion = 'No hay descripción disponible';
                        publicacion.tipoPub = 'nulo';
                    }
                }
            }

            // Eliminar publicaciones que no tienen descripción disponible
            const publicacionesFiltradas = respuesta.filter(publicacion => publicacion.tipoPub !== 'nulo');

            return res.send(publicacionesFiltradas);
        }
    } catch (error) {
        console.error("Error al obtener publicaciones: ", error);
        return res.status(500).send({ success: false, message: 'Error al obtener publicaciones' });
    }
}


/**
 * Crea una nueva publicacion
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function crearPublicacion(req, res) {
    try {
        // Valida el cuerpo de la solicitud
        const { error, value } = publicacionBodySchema.validate(req.body);

        if (error) {
            return res.code(400).send(error.message);
        }
        
        // si no se envia una imagen se le asigna una imagen por defecto
        if (req.body.imagen === undefined) {
            req.body.imagen = 1;
        }
        
        // Crea una nueva publicacion
        const newpublicacion = await createPublicacion(value);

        // Retorna la nueva publicacion
        res.code(201).send(newpublicacion);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar la publicacion:', error);
        res.code(500).send('Error al insertar la publicacion');
    }
}

/**
 * Actualiza una publicacion
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function actualizarPublicacion(req, res) {
    try {
        // Obtiene el id de la publicacion
        const id = req.params.id;

        // Valida el cuerpo de la solicitud
        const { error, value } = publicacionBodySchema.validate(req.body);

        if (error) {
            return res.code(400).send(error.message);
        }

        // Actualiza la publicacion
        const updatedpublicacion = await updatePublicacion(id, value);

        // Retorna la publicacion actualizada
        res.code(200).json(updatedpublicacion);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar la publicacion:', error);
        res.code(500).send('Error al actualizar la publicacion');
    }
}

/**
 * Elimina una publicacion
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function eliminarPublicacion(req, res) {
    try {
        // Obtiene el id de la publicacion
        const id = req.params.id;
        // Elimina la publicacion
        await deletePublicacion(id);

        // Retorna un mensaje de éxito
        res.code(200).send('Publicacion eliminada');
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar la publicacion:', error);
        res.code(500).send('Error al eliminar la publicacion');
    }
}

async function obtenerPublicacionesPorGrupoUsuario(req, res) {
    try {
        const { rut } = req.params;
        const respuesta = await getPublicacionesByGrupoUsuario(rut);
        if (respuesta.length === 0) {
            return res.send({ success: false, message: 'No se encontraron publicaciones' });
        } else {
            // Procesar cada elemento en la respuesta
            for (let i = 0; i < respuesta.length; i++) {
                const publicacion = respuesta[i];
                try {
                    const post = await getPostById(publicacion.id_pub);
                    if (post) {
                        publicacion.descripcion = post.cuerpo;
                        publicacion.tipoPub = 'post';
                    } else {
                        publicacion.descripcion = 'No hay descripción disponible';
                        publicacion.tipoPub = 'nulo';
                    }
                } catch (error) {
                    console.error(`Error al obtener el post con id ${publicacion.id_pub}: `, error);
                    publicacion.descripcion = 'No hay descripción disponible';
                    publicacion.tipoPub = 'nulo';
                }
            }

            // Procesar publicaciones que son formularios
            for (let i = 0; i < respuesta.length; i++) {
                const publicacion = respuesta[i];
                if (publicacion.tipoPub === 'nulo') {
                    try {
                        const formulario = await getFormularioById(publicacion.id_pub);
                        if (formulario) {
                            publicacion.descripcion = formulario.descripcion;
                            publicacion.hipervinculo = formulario.hipervinculo;
                            publicacion.tipoPub = 'formulario';
                        } else {
                            publicacion.descripcion = 'No hay descripción disponible';
                            publicacion.tipoPub = 'nulo';
                        }
                    } catch (error) {
                        console.error(`Error al obtener el formulario con id ${publicacion.id_pub}: `, error);
                        publicacion.descripcion = 'No hay descripción disponible';
                        publicacion.tipoPub = 'nulo';
                    }
                }
            }

            // Eliminar publicaciones que no tienen descripción disponible
            const publicacionesFiltradas = respuesta.filter(publicacion => publicacion.tipoPub !== 'nulo');

            return res.send(publicacionesFiltradas);
        }
    } catch (error) {
        console.error("Error al obtener publicaciones de los grupos del usuario: ", error);
        return res.status(500).send({ success: false, message: 'Error al obtener publicaciones de los grupos del usuario:' });
    }
}

async function ingresarTagsPublicacion(req, res) {
    try {
        const id_pub = req.body.id_pub;
        const tags = req.body.id_tag;
        const decoded = await req.jwtVerify();
        const rut = decoded.rut;
        const publicacion = await getPublicacionById(id_pub);
        if (!publicacion) {
            return res.code(404).send({ success: false, message: 'Publicacion no encontrada' });
        }
        const lider = await getLiderArray(publicacion.rows[0].id_agr);
        if (rut !== lider[0].rut) {
            return res.code(401).send({ success: false, message: 'No tienes permisos para ingresar tags' });
        }
        const result = await insertTagsPublicacion(id_pub, tags);
        if (!result) {
            return res.code(500).send({ success: false, message: 'Error al ingresar tags' });
        }
        res.code(200).send({ success: true, message: 'Tags ingresados correctamente' });
    } catch (error) {
        console.error('Error al ingresar tags:', error);
        res.code(500).send('Error al ingresar tags');
    }
}

async function obtenerTagsPublicacion(req, res) {
    try {
        const id_pub = req.params.id_pub;
        const tags = await getTagsPublicacion(id_pub);
        if (!tags) {
            return res.send({ success: false, message: 'No se encontraron tags' });
        }
        let TagsConNombre = [];
        for (let i = 0; i < tags.length; i++) {
            //TagsConNombre.push(await obtenerTagPorId(tags[i].id_tag).rows);
            const tagResult = await obtenerTagPorId(tags[i].id_tag);
            TagsConNombre.push(tagResult.rows[0]);
        }
        return res.send({ success: true, TagsConNombre });
    } catch (error) {
        console.error('Error al obtener los tags de la publicacion:', error);
        return res.status(500).send({ success: false, message: 'Error al obtener los tags de la publicacion' });
    }
}

module.exports = {
    obtenerPublicaciones,
    obtenerPublicacionesPorId,
    obtenerPublicacionesPorGrupo,
    crearPublicacion,
    actualizarPublicacion,
    eliminarPublicacion,
    obtenerPublicacionesPorGrupoUsuario,
    ingresarTagsPublicacion,
    obtenerTagsPublicacion
};