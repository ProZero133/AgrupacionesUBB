"use strict";

const {getPosts, getPostById, createPost, updatePost, deletePost} = require("../services/post.service");
const {getPublicacionById} = require("../services/publicacion.service.js");
const { getLiderArray } = require("../services/agrupacion.service.js");
const postBodySchema  = require("../schema/post.schema.js");

/**
 * Obtiene todas los posts
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function obtenerPosts(req, res) {
    try {
        // Obtiene todas los posts
        const posts = await getPosts();

        // Retorna las publicaciones
        res.code(201).send(posts);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener los posts:', error);
        res.code(500).send('Error al obtener los posts');
    }
}

/**
 * Obtiene un post por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function obtenerPostPorId(req, res) {
    try {
        // Obtiene el id del post
        const { id } = req.params;

        // Obtiene el post por su id
        const post = await getPostById(id);

        // Retorna el post
        res.code(200).send(post);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener el post:', error);
        res.code(500).send('Error al obtener el post');
    }
}

/**
 * Crea un nuevo post
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
*/

async function crearPost(req, res) {
    try {

        // Valida el cuerpo de la petición
        const decoded = await req.jwtVerify();
        const rut = decoded.rut;
        const { id_pub} = req.body;
        const publicacion = await getPublicacionById(id_pub);
        const lider = await getLiderArray(publicacion.rows[0].id_agr);
        if (rut !== lider[0].rut) {
            res.code(403).send({ success: false, message: 'Acceso denegado: No eres el lider de la agrupación' });
            return;
        }

        const { error } = postBodySchema.validate(req.body);

        if (error) {
            res.code(400).send(error.details.map(detail => detail.message));
            return;
        }

        // Crea un nuevo post
        const post = await createPost(req.body);

        // Retorna el post creado
        res.code(201).send(post);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al crear el post:', error);
        res.code(500).send('Error al crear el post');
    }
}

/**
 * Actualiza un post por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

/**
 * Elimina un post por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function eliminarPost(req, res) {
    try {
        // Obtiene el id del post
        const { id } = req.params;
        const decoded = await req.jwtVerify();
        const rut = decoded.rut;
        const rol = decoded.rol;
        const post = await getPostById(id);
        if (!post) {
            res.code(404).send({ success: false, message: 'El post no existe' });
            return;
        }
        const publicacion = await getPublicacionById(post.id_pub);
        if (!publicacion) {
            res.code(404).send({ success: false, message: 'La publicación no existe' });
            return;
        }
        const lider = await getLiderArray(publicacion.rows[0].id_agr);
        if (rut !== lider[0].rut && rol !== 'admin') {
            res.code(403).send({ success: false, message: 'Acceso denegado: No tienes permisos para eliminar el post' });
            return;
        }

        // Elimina el post por su id
        const response = await deletePost(id);

        if(response){
            res.code(204).send({ success: true, message: 'Post eliminado correctamente' });
            return;
        }
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar el post:', error);
        res.code(500).send('Error al eliminar el post');
    }
}

// Exporta los métodos del controlador
module.exports = {
    obtenerPosts,
    obtenerPostPorId,
    crearPost,
    eliminarPost
};